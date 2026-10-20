-- Migration: 20261013000001_living_cost_and_savings_fix.sql
-- Description: Implement 300 Yen daily living cost deduction on Long Rest RPC & enhance adjust_savings RPC to return full finances payload and support direct Yen transactions.

BEGIN;

-- 1. Long Rest RPC with Living Cost (300 Yen)
CREATE OR REPLACE FUNCTION public.long_rest(
  p_character_id UUID,
  p_client_version INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_char RECORD;
  v_new_vitals JSONB;
  v_daily_amt INT;
  v_wage_amt INT;
  v_living_cost INT := 300;
  v_net_change INT;
  v_cur_savings INT;
  v_new_savings INT;
  v_new_finances JSONB;
BEGIN
  SELECT * INTO v_char FROM public.characters WHERE id = p_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ERR_NOT_FOUND: Karakter tidak ditemukan.'; END IF;

  IF v_char.version <> p_client_version THEN
    RAISE EXCEPTION 'ERR_CONCURRENCY_CONFLICT: Versi data karakter telah diperbarui oleh perangkat lain.';
  END IF;

  -- Restore HP & Composure to Max, Reset Rest Dice
  v_new_vitals := v_char.vitals || jsonb_build_object(
    'physicalHpCurrent', (v_char.vitals->>'physicalHpMax')::int,
    'composureCurrent', (v_char.vitals->>'composureMax')::int,
    'restDiceSpent', 0
  );

  -- Auto Financial Deposit with Living Cost (300 Yen) deduction
  v_daily_amt := COALESCE((v_char.finances->>'dailyMoneyAmount')::int, 0);
  v_wage_amt := COALESCE((v_char.finances->>'jobWageAmount')::int, 0);
  v_cur_savings := COALESCE((v_char.finances->>'savingsAmount')::int, 0);
  
  v_net_change := v_daily_amt + v_wage_amt - v_living_cost;
  v_new_savings := GREATEST(0, v_cur_savings + v_net_change);

  v_new_finances := v_char.finances || jsonb_build_object(
    'savingsAmount', v_new_savings
  );

  UPDATE public.characters
  SET vitals = v_new_vitals,
      finances = v_new_finances,
      version = version + 1,
      updated_at = now()
  WHERE id = p_character_id;

  RETURN jsonb_build_object(
    'characterId', p_character_id,
    'vitals', v_new_vitals,
    'finances', v_new_finances,
    'depositDaily', v_daily_amt,
    'depositWage', v_wage_amt,
    'livingCost', v_living_cost,
    'netFinancialChange', v_net_change,
    'totalAdded', v_net_change,
    'newVersion', v_char.version + 1
  );
END;
$$;

-- 2. Adjust Savings RPC (supports direct Yen or Rupiah, returns full finances payload)
DROP FUNCTION IF EXISTS public.adjust_savings(UUID, NUMERIC, INT, TEXT);
DROP FUNCTION IF EXISTS public.adjust_savings(UUID, NUMERIC, INT, TEXT, INT);

CREATE OR REPLACE FUNCTION public.adjust_savings(
  p_character_id UUID,
  p_delta_rupiah NUMERIC DEFAULT NULL,
  p_client_version INT DEFAULT 1,
  p_note TEXT DEFAULT '',
  p_delta_yen INT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_char RECORD;
  v_cur_savings INT;
  v_delta_yen INT;
  v_new_savings INT;
  v_new_finances JSONB;
BEGIN
  SELECT * INTO v_char FROM public.characters WHERE id = p_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ERR_NOT_FOUND: Karakter tidak ditemukan.'; END IF;

  IF v_char.version <> p_client_version THEN
    RAISE EXCEPTION 'ERR_CONCURRENCY_CONFLICT: Versi data karakter telah diperbarui oleh perangkat lain.';
  END IF;

  -- Determine delta Yen: prioritize direct Yen if provided, otherwise compute from Rupiah (¥1 = Rp100)
  IF p_delta_yen IS NOT NULL THEN
    v_delta_yen := p_delta_yen;
  ELSE
    v_delta_yen := trunc(COALESCE(p_delta_rupiah, 0) / 100.0)::int;
  END IF;

  v_cur_savings := COALESCE((v_char.finances->>'savingsAmount')::int, 0);
  v_new_savings := v_cur_savings + v_delta_yen;

  IF v_new_savings < 0 THEN
    RAISE EXCEPTION 'ERR_INSUFFICIENT_FUNDS: Saldo tabungan tidak mencukupi untuk transaksi ini (Saldo: ¥%, Transaksi: ¥%).', v_cur_savings, v_delta_yen;
  END IF;

  v_new_finances := v_char.finances || jsonb_build_object(
    'savingsAmount', v_new_savings
  );

  UPDATE public.characters
  SET finances = v_new_finances,
      version = version + 1,
      updated_at = now()
  WHERE id = p_character_id;

  RETURN jsonb_build_object(
    'characterId', p_character_id,
    'deltaYen', v_delta_yen,
    'deltaRupiah', COALESCE(p_delta_rupiah, v_delta_yen * 100),
    'newSavingsAmount', v_new_savings,
    'finances', v_new_finances,
    'note', p_note,
    'newVersion', v_char.version + 1
  );
END;
$$;

-- Grant EXECUTE permissions for anon & authenticated roles so PostgREST exposes RPC in schema cache
GRANT EXECUTE ON FUNCTION public.long_rest(UUID, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_savings(UUID, NUMERIC, INT, TEXT, INT) TO anon, authenticated;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

COMMIT;
