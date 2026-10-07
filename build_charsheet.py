import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def build_charsheet():
    doc = Document()

    # Section Settings - A4 (8.27 x 11.69 in) with 0.28 in margins
    section = doc.sections[0]
    section.page_width = Inches(8.27)
    section.page_height = Inches(11.69)
    section.top_margin = Inches(0.28)
    section.bottom_margin = Inches(0.28)
    section.left_margin = Inches(0.38)
    section.right_margin = Inches(0.38)

    # Color Palette: Deep Navy & Sakura Crimson
    COLOR_PRIMARY = "1A365D"    # Deep Navy
    COLOR_SECONDARY = "9B2C2C"  # Crimson / Dark Rose
    COLOR_ACCENT = "C53030"     # Rose Red
    COLOR_DARK = "2D3748"       # Dark Slate Body Text
    COLOR_MUTED = "718096"      # Muted Gray
    COLOR_BG_LIGHT = "F7FAFC"   # Soft Light Shading
    COLOR_BG_BOX = "EDF2F7"     # Subtle Gray for Boxes
    COLOR_BG_ROSE = "FFF5F5"    # Soft Rose Tint
    COLOR_BORDER = "CBD5E0"     # Crisp Border
    COLOR_BORDER_NAVY = "2B6CB0"# Navy Border

    def set_cell_bg(cell, hex_color):
        tcPr = cell._tc.get_or_add_tcPr()
        tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'))

    def set_cell_margins(cell, top=25, bottom=25, left=50, right=50):
        tcPr = cell._tc.get_or_add_tcPr()
        tcPr.append(parse_xml(f'''<w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>'''))

    def set_cell_borders(cell, top=None, bottom=None, left=None, right=None):
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}/>')
        borders = {'top': top, 'bottom': bottom, 'left': left, 'right': right}
        for b_name, b_val in borders.items():
            if b_val:
                tcBorders.append(parse_xml(f'<w:{b_name} {nsdecls("w")} w:val="{b_val.get("val","single")}" w:sz="{b_val.get("sz","4")}" w:space="0" w:color="{b_val.get("color","auto")}"/>'))
            else:
                tcBorders.append(parse_xml(f'<w:{b_name} {nsdecls("w")} w:val="none"/>'))
        tcPr.append(tcBorders)

    def format_run(run, font_name="Segoe UI", size_pt=8, bold=False, italic=False, color_rgb=(45, 55, 72)):
        run.font.name = font_name
        run.font.size = Pt(size_pt)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = RGBColor(*color_rgb)

    def add_p(cell_or_doc, text="", align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=1):
        if hasattr(cell_or_doc, 'add_paragraph'):
            p = cell_or_doc.add_paragraph()
        else:
            p = cell_or_doc.paragraphs[0] if len(cell_or_doc.paragraphs) > 0 else cell_or_doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.0
        run = p.add_run(text if text else " ")
        format_run(run)
        return p

    def set_table_col_widths(table, widths):
        for row in table.rows:
            for idx, width in enumerate(widths):
                if idx < len(row.cells):
                    row.cells[idx].width = width

    # =========================================================================
    # PAGE 1: CORE STATS, IDENTITY, VITALITY, ACTIONS
    # =========================================================================
    # Title Banner Table
    banner = doc.add_table(rows=1, cols=2)
    banner.alignment = WD_TABLE_ALIGNMENT.CENTER
    banner.autofit = False
    set_table_col_widths(banner, [Inches(2.8), Inches(4.71)])

    c_logo = banner.cell(0, 0)
    set_cell_bg(c_logo, COLOR_PRIMARY)
    set_cell_margins(c_logo, top=40, bottom=40, left=70, right=70)
    set_cell_borders(c_logo, top={'color': COLOR_PRIMARY, 'sz': 6}, bottom={'color': COLOR_PRIMARY, 'sz': 6},
                             left={'color': COLOR_PRIMARY, 'sz': 6}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_logo, "DAMSEL & DESIRE", space_before=0, space_after=0)
    format_run(p.runs[0], font_name="Segoe UI Black", size_pt=14, bold=True, color_rgb=(255, 255, 255))
    p = add_p(c_logo, "Japanese High School Romance TRPG", space_before=0, space_after=0)
    format_run(p.runs[0], font_name="Segoe UI Semibold", size_pt=7.5, italic=True, color_rgb=(246, 173, 85))
    p = add_p(c_logo, "CHARACTER RECORD SHEET", space_before=0, space_after=0)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=6.5, bold=True, color_rgb=(203, 213, 224))

    c_info = banner.cell(0, 1)
    set_cell_bg(c_info, COLOR_BG_LIGHT)
    set_cell_margins(c_info, top=15, bottom=15, left=30, right=30)
    set_cell_borders(c_info, top={'color': COLOR_BORDER, 'sz': 4}, bottom={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})

    info_grid = c_info.add_table(rows=3, cols=3)
    info_grid.alignment = WD_TABLE_ALIGNMENT.CENTER
    info_grid.autofit = False
    set_table_col_widths(info_grid, [Inches(1.6), Inches(1.5), Inches(1.51)])

    h_data = [
        [("NAMA KARAKTER", "Character Name"), ("ARCHETYPE (RAS)", "Delinquent / Sporty / Nerd / etc."), ("KELAS / LEVEL", "Kelas 10 / Lvl 1")],
        [("EKSKUL (CLASS)", "Klub / Organisasi Siswa"), ("SPESIALISASI EKSKUL", "Subclass / Jabatan Klub"), ("ORIGIN / SOCIAL CLASS", "Rich / Medium / Poor / etc.")],
        [("NAMA PEMAIN", "Player Name"), ("EXP / YOUTH CREDITS", "0 / 300 XP"), ("INSPIRASI DESIRE", "[   ] Heart Token")]
    ]
    for r_i, row in enumerate(h_data):
        for c_i, (label, val) in enumerate(row):
            cell = info_grid.cell(r_i, c_i)
            set_cell_bg(cell, "FFFFFF" if (r_i+c_i)%2==0 else COLOR_BG_LIGHT)
            set_cell_margins(cell, top=12, bottom=12, left=25, right=25)
            set_cell_borders(cell, bottom={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
            p1 = add_p(cell, label, space_before=0, space_after=0)
            format_run(p1.runs[0], font_name="Segoe UI", size_pt=5.5, bold=True, color_rgb=(113, 128, 150))
            p2 = add_p(cell, val, space_before=0, space_after=0)
            format_run(p2.runs[0], font_name="Segoe UI", size_pt=7, italic=True, color_rgb=(45, 55, 72))

    # Core Vitals
    vitals = doc.add_table(rows=1, cols=7)
    vitals.alignment = WD_TABLE_ALIGNMENT.CENTER
    vitals.autofit = False
    set_table_col_widths(vitals, [Inches(1.05), Inches(0.95), Inches(0.95), Inches(1.96), Inches(1.1), Inches(1.1), Inches(0.4)])

    vital_items = [
        ("SOCIAL AC", "10", "Harga Diri", COLOR_BG_BOX, COLOR_PRIMARY),
        ("INITIATIVE", "+0", "Refleks Situasi", COLOR_BG_BOX, COLOR_PRIMARY),
        ("SPEED", "30 ft", "Mobilitas", COLOR_BG_BOX, COLOR_PRIMARY),
        ("COMPOSURE (HP MENTAL)", "Max: [   ]   Current: [   ]", "Temp Composure: [       ]", COLOR_BG_ROSE, COLOR_SECONDARY),
        ("REST DICE (HD)", "1d8", "Total: [   ] Spent: [   ]", COLOR_BG_BOX, COLOR_PRIMARY),
        ("MELTDOWN SAVES", "○ ○ ○  Sukses\n○ ○ ○  Gagal", "Social Breakdown", COLOR_BG_ROSE, COLOR_SECONDARY),
        ("PROF", "+2", "Bonus", COLOR_PRIMARY, "FFFFFF")
    ]

    for idx, (title, main_val, sub_val, bg, accent) in enumerate(vital_items):
        cell = vitals.cell(0, idx)
        set_cell_bg(cell, bg)
        set_cell_margins(cell, top=15, bottom=15, left=15, right=15)
        set_cell_borders(cell, top={'color': accent if accent!="FFFFFF" else COLOR_PRIMARY, 'sz': 6},
                               bottom={'color': COLOR_BORDER, 'sz': 4},
                               left={'color': COLOR_BORDER, 'sz': 4},
                               right={'color': COLOR_BORDER, 'sz': 4})
        is_prof = (idx == 6)
        p = add_p(cell, title, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p.runs[0], font_name="Segoe UI", size_pt=5.5, bold=True, color_rgb=(255, 255, 255) if is_prof else (26, 54, 93))
        p2 = add_p(cell, main_val, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p2.runs[0], font_name="Segoe UI Black", size_pt=10 if not idx in [3, 5] else 7, bold=True, color_rgb=(255, 255, 255) if is_prof else (45, 55, 72))
        p3 = add_p(cell, sub_val, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p3.runs[0], font_name="Segoe UI", size_pt=5.5, italic=True, color_rgb=(203, 213, 224) if is_prof else (113, 128, 150))

    # Stats Section Header
    p_sec = doc.add_paragraph()
    p_sec.paragraph_format.space_before = Pt(1)
    p_sec.paragraph_format.space_after = Pt(0)
    r = p_sec.add_run("ABILITY SCORES, SAVING THROWS & 18 SUB-SKILLS")
    format_run(r, font_name="Segoe UI Black", size_pt=8, bold=True, color_rgb=(26, 54, 93))
    r2 = p_sec.add_run("  (Elemen Konversi D&D → Damsel & Desire)")
    format_run(r2, font_name="Segoe UI", size_pt=6.5, italic=True, color_rgb=(113, 128, 150))

    # 6 Stats Table
    stat_cards = doc.add_table(rows=2, cols=3)
    stat_cards.alignment = WD_TABLE_ALIGNMENT.CENTER
    stat_cards.autofit = False
    set_table_col_widths(stat_cards, [Inches(2.5), Inches(2.5), Inches(2.51)])

    stats_data = [
        {"name": "ATHLETIC", "dnd": "STR / DEX / CON", "skills": [("Strength", "Angkat berat, dorong, tahan fisik"), ("Dexterity", "Refleks cepat, kelenturan, kejar kereta"), ("Constitution", "Stamina begadang, tahan lari maraton")]},
        {"name": "INTELLIGENT", "dnd": "INT / WIS Logic", "skills": [("Academic Smart", "Ujian sekolah, wawasan, rumus"), ("People Smart", "Baca psikologi, deteksi kebohongan"), ("Street Smart", "Trik pergaulan, gosip, akal-akalan")]},
        {"name": "LOOKS", "dnd": "CHA / Attractiveness", "skills": [("Charisma", "Pesona personal, senyuman, rayuan"), ("Influence", "Pengaruh reputasi sekolah, wibawa"), ("Aura", "Kehadiran mencolok / vibes misterius")]},
        {"name": "MIND", "dnd": "WIS Mental", "skills": [("Emotional Intel.", "Kontrol emosi, jaim, empati hati"), ("Interpersonal Intel.", "Koneksi mendalam, peka perasaan doi"), ("Awareness", "Membaca atmosfer ('Kuuki Yomenai')")]},
        {"name": "LUCK", "dnd": "Fate / Inspiration", "skills": [("Relationship Luck", "Papasan romantis, tabrakan bawa roti"), ("Situation Luck", "Lolos razia guru BP, nemu payung"), ("Academic Luck", "Hoki tebak kancing, guru ga masuk")]},
        {"name": "TALENT", "dnd": "Performance / Art", "skills": [("Creative", "Ide seni, surat cinta, desain festival"), ("Performance", "Akting drama, bernyanyi, musik, pidato"), ("Adaptability", "Improvisasi kilat saat skenario gagal")]}
    ]

    for idx, stat in enumerate(stats_data):
        cell = stat_cards.cell(idx // 3, idx % 3)
        set_cell_bg(cell, "FFFFFF")
        set_cell_margins(cell, top=18, bottom=18, left=35, right=35)
        set_cell_borders(cell, top={'color': COLOR_PRIMARY, 'sz': 6}, bottom={'color': COLOR_BORDER, 'sz': 4},
                               left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})

        p = add_p(cell, f'{stat["name"]}  ({stat["dnd"]})', space_after=0)
        format_run(p.runs[0], font_name="Segoe UI Black", size_pt=7.5, bold=True, color_rgb=(26, 54, 93))

        b_tab = cell.add_table(rows=1, cols=3)
        b_tab.alignment = WD_TABLE_ALIGNMENT.CENTER
        b_tab.autofit = False
        set_table_col_widths(b_tab, [Inches(0.6), Inches(0.6), Inches(1.1)])

        c1 = b_tab.cell(0, 0)
        set_cell_bg(c1, COLOR_BG_BOX)
        set_cell_margins(c1, 8, 8, 8, 8)
        p = add_p(c1, "SCORE\n10", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p.runs[0], font_name="Segoe UI Black", size_pt=7, bold=True, color_rgb=(45, 55, 72))

        c2 = b_tab.cell(0, 1)
        set_cell_bg(c2, COLOR_PRIMARY)
        set_cell_margins(c2, 8, 8, 8, 8)
        p = add_p(c2, "MOD\n+0", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p.runs[0], font_name="Segoe UI Black", size_pt=7, bold=True, color_rgb=(255, 255, 255))

        c3 = b_tab.cell(0, 2)
        set_cell_bg(c3, COLOR_BG_LIGHT)
        set_cell_margins(c3, 8, 8, 15, 8)
        p = add_p(c3, "[  ] SAVE THROW\nBonus: [ +0 ]", align=WD_ALIGN_PARAGRAPH.LEFT, space_after=0)
        format_run(p.runs[0], font_name="Segoe UI Semibold", size_pt=5.5, bold=True, color_rgb=(26, 54, 93))

        for sk_n, sk_d in stat["skills"]:
            p = add_p(cell, f"[  ] {sk_n} ({sk_d})", space_before=0, space_after=0)
            format_run(p.runs[0], font_name="Segoe UI", size_pt=6, color_rgb=(45, 55, 72))

    # Senses & Proficiencies
    senses_tab = doc.add_table(rows=1, cols=2)
    senses_tab.alignment = WD_TABLE_ALIGNMENT.CENTER
    senses_tab.autofit = False
    set_table_col_widths(senses_tab, [Inches(3.75), Inches(3.76)])

    c_s = senses_tab.cell(0, 0)
    set_cell_bg(c_s, COLOR_BG_LIGHT)
    set_cell_margins(c_s, 15, 15, 30, 30)
    set_cell_borders(c_s, top={'color': COLOR_PRIMARY, 'sz': 4}, bottom={'color': COLOR_BORDER, 'sz': 4}, left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_s, "SENSES (INDRA & KEPEKAAN PASIF)", space_after=0)
    format_run(p.runs[0], font_name="Segoe UI Black", size_pt=6.5, bold=True, color_rgb=(26, 54, 93))
    p = add_p(c_s, "[ 10 ] Passive Perception (10 + Mind / Awareness) — Lirik tatapan rahasia\n[ 10 ] Passive Insight (10 + Mind / Interpersonal) — Peka salting & motif bohong\n[ 10 ] Passive Investigation (10 + Intel / Academic) — Temu surat cinta di loker", space_after=0)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=5.5, color_rgb=(45, 55, 72))

    c_p = senses_tab.cell(0, 1)
    set_cell_bg(c_p, COLOR_BG_LIGHT)
    set_cell_margins(c_p, 15, 15, 30, 30)
    set_cell_borders(c_p, top={'color': COLOR_PRIMARY, 'sz': 4}, bottom={'color': COLOR_BORDER, 'sz': 4}, left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_p, "PROFISIENSI PERALATAN, GAYA & BAHASA", space_after=0)
    format_run(p.runs[0], font_name="Segoe UI Black", size_pt=6.5, bold=True, color_rgb=(26, 54, 93))
    p = add_p(c_p, "• Gaya Seragam: Standar Blazer, Casual Modis, Gyaru, Olahraga\n• Alat Ekskul & Hobi: Shinai Kendo, Kamera, Kuas Lukis, Laptop, Alat Masak\n• Bahasa & Dialek: Bahasa Jepang (Standar), Bahasa Inggris, Kansai-ben, Slang Gaul", space_after=0)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=5.5, color_rgb=(45, 55, 72))

    # Actions table
    p_act = doc.add_paragraph()
    p_act.paragraph_format.space_before = Pt(1)
    p_act.paragraph_format.space_after = Pt(0)
    r = p_act.add_run("ACTIONS, MOVES & ROMANCE TECHNIQUES (AKSI & SERANGAN MENTAL)")
    format_run(r, font_name="Segoe UI Black", size_pt=7.5, bold=True, color_rgb=(26, 54, 93))

    act_tab = doc.add_table(rows=5, cols=5)
    act_tab.alignment = WD_TABLE_ALIGNMENT.CENTER
    act_tab.autofit = False
    set_table_col_widths(act_tab, [Inches(1.8), Inches(1.1), Inches(1.2), Inches(1.5), Inches(1.91)])

    heads = ["NAMA AKSI / MOVES", "JANGKAUAN", "STAT / CHECK", "DAMAGE / HEART EFFECT", "CATATAN & SYARAT"]
    for c_i, h in enumerate(heads):
        c = act_tab.cell(0, c_i)
        set_cell_bg(c, COLOR_PRIMARY)
        set_cell_margins(c, 15, 15, 25, 25)
        p = add_p(c, h, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p.runs[0], font_name="Segoe UI", size_pt=6, bold=True, color_rgb=(255, 255, 255))

    moves = [
        ("Tsundere Glare / Retort", "Tatapan (15 ft)", "Mind / Looks (+2)", "1d4 + Mod Malu", "Target kehilangan Composure saat salting"),
        ("Sweet Talk / Senyum Manis", "Bicara (Touch/5 ft)", "Looks / Charisma (+2)", "1d6 + Mod Kasmaran", "Target tersipu; Disadvantage save berikutnya"),
        ("Tawaran Belajar Bareng", "Meja Kelas (5 ft)", "Intel / Academic (+2)", "+1d4 Heart Affection", "Membuka obrolan berdua saat sepulang sekolah"),
        ("Tebasan Shinai / Pukulan Olahraga", "Jarak Dekat (5 ft)", "Athletic / Str (+2)", "1d6 + Mod Fisik", "Hanya sah saat tanding ekskul / bela diri")
    ]
    for r_i, m in enumerate(moves, start=1):
        for c_i, val in enumerate(m):
            c = act_tab.cell(r_i, c_i)
            set_cell_bg(c, "FFFFFF" if r_i%2==1 else COLOR_BG_LIGHT)
            set_cell_margins(c, 10, 10, 25, 25)
            set_cell_borders(c, bottom={'color': COLOR_BORDER, 'sz': 4}, left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
            p = add_p(c, val, space_after=0)
            format_run(p.runs[0], font_name="Segoe UI", size_pt=6, color_rgb=(45, 55, 72))

    # =========================================================================
    # PAGE 2: PERSONALITY, ARCHETYPE, EKSKUL, ORIGIN & INVENTORY
    # =========================================================================
    doc.add_page_break()

    p_p2_h = doc.add_paragraph()
    p_p2_h.paragraph_format.space_before = Pt(0)
    p_p2_h.paragraph_format.space_after = Pt(2)
    r_p2 = p_p2_h.add_run("DAMSEL & DESIRE — ROLEPLAY, LATAR BELAKANG & INVENTORY")
    format_run(r_p2, font_name="Segoe UI Black", size_pt=11, bold=True, color_rgb=(26, 54, 93))

    p2_grid = doc.add_table(rows=1, cols=2)
    p2_grid.alignment = WD_TABLE_ALIGNMENT.CENTER
    p2_grid.autofit = False
    set_table_col_widths(p2_grid, [Inches(3.75), Inches(3.76)])

    # Left Column: Personality Blocks
    c_p2_left = p2_grid.cell(0, 0)
    set_cell_bg(c_p2_left, "FFFFFF")
    set_cell_margins(c_p2_left, top=20, bottom=20, left=30, right=30)
    set_cell_borders(c_p2_left, right={'color': COLOR_BORDER, 'sz': 4})

    roleplay_boxes = [
        ("PERSONALITY TRAITS (SIFAT & KEBIASAAN)", 
         "Ciri khas bicara, kebiasaan unik saat gugup, ekspresi default di kelas:\n[                                                                                                                                                                          ]"),
        ("IDEALS & YOUTH DREAMS (PRINSIP & CITA-CITA)", 
         "Apa impian terbesarmu di masa SMA? Kebebasan, cinta sejati, prestasi, atau persahabatan?\n[                                                                                                                                                                          ]"),
        ("BONDS & JANJI MASA LALU (IKATAN PENTING)", 
         "Siapa yang paling ingin kau lindungi? Janji masa kecil dengan siapa yang belum terpenuhi?\n[                                                                                                                                                                          ]"),
        ("FLAWS & INSECURITIES (KELEMAHAN & RASA MINDER)", 
         "Hal yang bikin kamu langsung salting, rahasia memalukan, atau trauma masa lalu:\n[                                                                                                                                                                          ]")
    ]

    for title, hint in roleplay_boxes:
        p_box_h = add_p(c_p2_left, title, space_before=1, space_after=1)
        format_run(p_box_h.runs[0], font_name="Segoe UI Black", size_pt=7.5, bold=True, color_rgb=(26, 54, 93))
        
        t_box = c_p2_left.add_table(rows=1, cols=1)
        t_box.alignment = WD_TABLE_ALIGNMENT.CENTER
        t_box.autofit = False
        t_box.rows[0].cells[0].width = Inches(3.6)
        c_in = t_box.cell(0, 0)
        set_cell_bg(c_in, COLOR_BG_LIGHT)
        set_cell_margins(c_in, top=20, bottom=20, left=30, right=30)
        set_cell_borders(c_in, top={'color': COLOR_BORDER, 'sz': 4}, bottom={'color': COLOR_BORDER, 'sz': 4},
                               left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
        p = add_p(c_in, hint, space_after=6)
        format_run(p.runs[0], font_name="Segoe UI", size_pt=6.5, italic=True, color_rgb=(113, 128, 150))

    # Right Column: Archetype, Ekskul, Social Class
    c_p2_right = p2_grid.cell(0, 1)
    set_cell_bg(c_p2_right, "FFFFFF")
    set_cell_margins(c_p2_right, top=20, bottom=20, left=30, right=30)

    feature_boxes = [
        ("ARCHETYPE TRAITS (FITUR RAS: DELINQUENT / SPORTY / NERD / DLL)",
         "Pilihan Archetype: Delinquent, Sporty, Nerd, Class clown, Emo, Weeb, Populer kids, Normies.\nKeunggulan & kebiasaan unik tipe karaktermu:\n[                                                                                                                                                                          ]"),
        ("EKSKUL PERKS (FITUR KELAS: STUDENT COUNCIL / BAND / KENDO / DLL)",
         "Pilihan Ekskul: Student Council, Kendo, Martial art, Olahraga, Drama, KIR/OSN, Pramuka/Paskin, Pecinta Alam, Penyiaran, Literatur, Band, Painting, Photography, Cooking, Occult, Gaming.\nKemampuan khusus, hak akses ruangan klub, fasilitas ekskul:\n[                                                                                                                                                                          ]"),
        ("ORIGIN & SOCIAL CLASS PERKS (STATUS FINANSIAL / KELUARGA)",
         "Pilihan Social Class: Rich, Medium rich, Medium, Medium poor, Poor, Orphanage.\nPengaruh keluarga, fasilitas rumah, uang saku harian, dan koneksi orang tua:\n[                                                                                                                                                                          ]")
    ]

    for title, hint in feature_boxes:
        p_box_h = add_p(c_p2_right, title, space_before=1, space_after=1)
        format_run(p_box_h.runs[0], font_name="Segoe UI Black", size_pt=7.5, bold=True, color_rgb=(155, 44, 44))
        
        t_box = c_p2_right.add_table(rows=1, cols=1)
        t_box.alignment = WD_TABLE_ALIGNMENT.CENTER
        t_box.autofit = False
        t_box.rows[0].cells[0].width = Inches(3.6)
        c_in = t_box.cell(0, 0)
        set_cell_bg(c_in, COLOR_BG_ROSE)
        set_cell_margins(c_in, top=20, bottom=20, left=30, right=30)
        set_cell_borders(c_in, top={'color': COLOR_SECONDARY, 'sz': 4}, bottom={'color': COLOR_BORDER, 'sz': 4},
                               left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
        p = add_p(c_in, hint, space_after=9)
        format_run(p.runs[0], font_name="Segoe UI", size_pt=6.5, italic=True, color_rgb=(113, 128, 150))

    # Inventory & Belongings Table
    p_inv_h = doc.add_paragraph()
    p_inv_h.paragraph_format.space_before = Pt(2)
    p_inv_h.paragraph_format.space_after = Pt(1)
    r_inv = p_inv_h.add_run("SCHOOL BAG, INVENTORY & POCKET MONEY (TAS SEKOLAH & KEKAYAAN)")
    format_run(r_inv, font_name="Segoe UI Black", size_pt=8, bold=True, color_rgb=(26, 54, 93))

    inv_table = doc.add_table(rows=2, cols=3)
    inv_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    inv_table.autofit = False
    set_table_col_widths(inv_table, [Inches(2.7), Inches(2.7), Inches(2.11)])

    inv_heads = ["ISI TAS SEKOLAH (BAG)", "BENDA SPESIAL / JIMAT / KEEPSAKES", "UANG SAKU & TABUNGAN"]
    for c_i, h_text in enumerate(inv_heads):
        c = inv_table.cell(0, c_i)
        set_cell_bg(c, COLOR_PRIMARY)
        set_cell_margins(c, top=15, bottom=15, left=30, right=30)
        p = add_p(c, h_text, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p.runs[0], font_name="Segoe UI", size_pt=6.5, bold=True, color_rgb=(255, 255, 255))

    c_bag = inv_table.cell(1, 0)
    set_cell_bg(c_bag, COLOR_BG_LIGHT)
    set_cell_margins(c_bag, top=20, bottom=20, left=30, right=30)
    set_cell_borders(c_bag, bottom={'color': COLOR_BORDER, 'sz': 4}, left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_bag, "• Buku Pelajaran & Catatan Sekolah\n• Smartphone & Earphone\n• Kotak Pensil & Penghapus\n• Bekal Bento Buatan Sendiri / Ibu\n• Payung Lipat (Jaga-jaga hujan)", space_after=6)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=6.5, color_rgb=(45, 55, 72))

    c_keep = inv_table.cell(1, 1)
    set_cell_bg(c_keep, COLOR_BG_LIGHT)
    set_cell_margins(c_keep, top=20, bottom=20, left=30, right=30)
    set_cell_borders(c_keep, bottom={'color': COLOR_BORDER, 'sz': 4}, left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_keep, "• Jimat Kuil Omamori (Keberuntungan Asmara)\n• Surat Cinta (Belum sempat diberikan)\n• Foto Polaroid Kenangan Bersama Teman\n• Gantungan Kunci Spesial / Pasangan", space_after=6)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=6.5, color_rgb=(45, 55, 72))

    c_mon = inv_table.cell(1, 2)
    set_cell_bg(c_mon, COLOR_BG_BOX)
    set_cell_margins(c_mon, top=20, bottom=20, left=30, right=30)
    set_cell_borders(c_mon, bottom={'color': COLOR_BORDER, 'sz': 4}, left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_mon, "Uang Saku Harian:\n¥ _________ / Rp _________\nTabungan / Bank:\n¥ _________ / Rp _________\nKerja Paruh Waktu (Baitto):\n[                                         ]", space_after=2)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=6.5, color_rgb=(45, 55, 72))

    # Appearance & Origin Story Summary
    app_table = doc.add_table(rows=1, cols=2)
    app_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    app_table.autofit = False
    set_table_col_widths(app_table, [Inches(3.75), Inches(3.76)])

    c_app = app_table.cell(0, 0)
    set_cell_bg(c_app, "FFFFFF")
    set_cell_margins(c_app, top=20, bottom=20, left=30, right=30)
    set_cell_borders(c_app, top={'color': COLOR_BORDER, 'sz': 4}, bottom={'color': COLOR_BORDER, 'sz': 4},
                            left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_app, "DESKRIPSI PENAMPILAN & GAYA VISUAL", space_after=1)
    format_run(p.runs[0], font_name="Segoe UI Black", size_pt=7, bold=True, color_rgb=(26, 54, 93))
    p = add_p(c_app, "Tinggi/Berat: _____ cm / _____ kg   Rambut/Mata: ______________\nCiri Khas Fisik / Modifikasi Seragam (Anting, Dasi Longgar, Pita Khas):\n[                                                                                                                                           ]", space_after=8)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=6, italic=True, color_rgb=(113, 128, 150))

    c_back = app_table.cell(0, 1)
    set_cell_bg(c_back, "FFFFFF")
    set_cell_margins(c_back, top=20, bottom=20, left=30, right=30)
    set_cell_borders(c_back, top={'color': COLOR_BORDER, 'sz': 4}, bottom={'color': COLOR_BORDER, 'sz': 4},
                             left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_back, "RINGKASAN ORIGIN STORY (SEJARAH MASA LALU)", space_after=1)
    format_run(p.runs[0], font_name="Segoe UI Black", size_pt=7, bold=True, color_rgb=(26, 54, 93))
    p = add_p(c_back, "Latar belakang keluarga, asal SMP, alasan memilih SMA ini, dan peristiwa besar masa lalu:\n[                                                                                                                                           ]", space_after=8)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=6, italic=True, color_rgb=(113, 128, 150))

    # =========================================================================
    # PAGE 3: AFFECTION TRACKER, ROMANCE FLAGS, DRAMA SLOTS & NOTES
    # =========================================================================
    doc.add_page_break()

    p_p3_h = doc.add_paragraph()
    p_p3_h.paragraph_format.space_before = Pt(0)
    p_p3_h.paragraph_format.space_after = Pt(2)
    r_p3 = p_p3_h.add_run("DAMSEL & DESIRE — AFFECTION METER, DRAMA SLOTS & SCHOOL LOG")
    format_run(r_p3, font_name="Segoe UI Black", size_pt=11, bold=True, color_rgb=(155, 44, 44))

    p_aff_sub = doc.add_paragraph()
    p_aff_sub.paragraph_format.space_after = Pt(2)
    r_sub_t = p_aff_sub.add_run("AFFECTION & RELATIONSHIP TRACKER (PENGUKUR HUBUNGAN & TARGET CINTA)")
    format_run(r_sub_t, font_name="Segoe UI Black", size_pt=8, bold=True, color_rgb=(155, 44, 44))
    r_sub_note = p_aff_sub.add_run("  (Fitur Khas Damsel & Desire untuk melacak status asmara & rivalitas antar karakter)")
    format_run(r_sub_note, font_name="Segoe UI", size_pt=6.5, italic=True, color_rgb=(113, 128, 150))

    # Affection Meter Table (5 target slots)
    aff_table = doc.add_table(rows=6, cols=5)
    aff_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    aff_table.autofit = False
    set_table_col_widths(aff_table, [Inches(1.8), Inches(1.3), Inches(1.2), Inches(1.6), Inches(1.61)])

    aff_headers = ["TARGET ROMANSA / RIVAL", "ARCHETYPE & EKSKUL", "STATUS HUBUNGAN", "METERAN HATI (AFFECTION)", "EVENT FLAGS & RAHASIA"]
    for c_i, h_text in enumerate(aff_headers):
        c = aff_table.cell(0, c_i)
        set_cell_bg(c, COLOR_SECONDARY)
        set_cell_margins(c, top=20, bottom=20, left=25, right=25)
        p = add_p(c, h_text, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p.runs[0], font_name="Segoe UI", size_pt=6, bold=True, color_rgb=(255, 255, 255))

    sample_targets = [
        ("Contoh: Yukinoshita (Crush)", "Populer / Student Council", "Teman Kelas (Secret Crush)", "♥ ♥ ♥ ♥ ○ ○ ○ ○ ○ ○ (4/10)", "Pernah payungan bareng pas hujan"),
        ("Contoh: Ryuji (Rival / Sahabat)", "Delinquent / Kendo", "Rival Akrab", "♥ ♥ ♥ ○ ○ ○ ○ ○ ○ ○ (3/10)", "Sering tanding sepulang sekolah"),
        ("[ Target Romansa 1 ]", "", "Stranger / Teman / Crush", "○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ( /10)", ""),
        ("[ Target Romansa 2 ]", "", "Stranger / Teman / Crush", "○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ( /10)", ""),
        ("[ Target Romansa 3 / Rival ]", "", "Stranger / Teman / Crush", "○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ( /10)", "")
    ]

    for r_i, target in enumerate(sample_targets, start=1):
        bg = "FFFFFF" if r_i % 2 == 1 else COLOR_BG_ROSE
        for c_i, val in enumerate(target):
            c = aff_table.cell(r_i, c_i)
            set_cell_bg(c, bg)
            set_cell_margins(c, top=15, bottom=15, left=25, right=25)
            set_cell_borders(c, bottom={'color': COLOR_BORDER, 'sz': 4},
                                left={'color': COLOR_BORDER, 'sz': 4},
                                right={'color': COLOR_BORDER, 'sz': 4})
            p = add_p(c, val, space_after=0)
            format_run(p.runs[0], font_name="Segoe UI", size_pt=6, color_rgb=(45, 55, 72))

    # Desire Points & Drama Slots Table
    p_drama_h = doc.add_paragraph()
    p_drama_h.paragraph_format.space_before = Pt(2)
    p_drama_h.paragraph_format.space_after = Pt(1)
    r_dr = p_drama_h.add_run("DESIRE POINTS & DRAMA SLOTS (SUMBER DAYA EMOSIONAL / SPELL SLOTS)")
    format_run(r_dr, font_name="Segoe UI Black", size_pt=8, bold=True, color_rgb=(26, 54, 93))

    drama_table = doc.add_table(rows=2, cols=4)
    drama_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    drama_table.autofit = False
    set_table_col_widths(drama_table, [Inches(1.85), Inches(1.85), Inches(1.85), Inches(1.96)])

    drama_levels = [
        ("TIER 1: FLIRT & CHAT", "Total: [ 4 ]  Used: [     ]", "Aksi obrolan manis, curi pandang, traktiran kantin"),
        ("TIER 2: DATE & DRAMA", "Total: [ 3 ]  Used: [     ]", "Kencan pulang sekolah, bikin bento, bela dari rundungan"),
        ("TIER 3: CONFESSION", "Total: [ 2 ]  Used: [     ]", "Ungkapan perasaan di atap sekolah, momen festival kembang api"),
        ("DESIRE SURGE (BURST)", "Token:  ○  ○  ○", "Mengubah kegagalan sosial fatal jadi momen romantis dramatis!")
    ]

    for c_i, (t_title, t_slots, t_desc) in enumerate(drama_levels):
        c_h = drama_table.cell(0, c_i)
        set_cell_bg(c_h, COLOR_PRIMARY)
        set_cell_margins(c_h, top=15, bottom=15, left=20, right=20)
        p = add_p(c_h, t_title, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p.runs[0], font_name="Segoe UI", size_pt=6, bold=True, color_rgb=(255, 255, 255))

        c_b = drama_table.cell(1, c_i)
        set_cell_bg(c_b, COLOR_BG_LIGHT)
        set_cell_margins(c_b, top=15, bottom=15, left=20, right=20)
        set_cell_borders(c_b, bottom={'color': COLOR_BORDER, 'sz': 4}, left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
        p = add_p(c_b, t_slots, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=1)
        format_run(p.runs[0], font_name="Segoe UI Black", size_pt=7, bold=True, color_rgb=(26, 54, 93))
        p2 = add_p(c_b, t_desc, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
        format_run(p2.runs[0], font_name="Segoe UI", size_pt=5.5, italic=True, color_rgb=(113, 128, 150))

    # School Rumors, Calendar & Notes
    p_log_h = doc.add_paragraph()
    p_log_h.paragraph_format.space_before = Pt(2)
    p_log_h.paragraph_format.space_after = Pt(1)
    r_log = p_log_h.add_run("SCHOOL RUMORS, CALENDAR & SESSION LOG (GOSIP SEKOLAH & AGENDA TAHUN AJARAN)")
    format_run(r_log, font_name="Segoe UI Black", size_pt=8, bold=True, color_rgb=(26, 54, 93))

    log_table = doc.add_table(rows=1, cols=2)
    log_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    log_table.autofit = False
    set_table_col_widths(log_table, [Inches(3.75), Inches(3.76)])

    c_rumor = log_table.cell(0, 0)
    set_cell_bg(c_rumor, "FFFFFF")
    set_cell_margins(c_rumor, top=20, bottom=20, left=30, right=30)
    set_cell_borders(c_rumor, top={'color': COLOR_BORDER, 'sz': 4}, bottom={'color': COLOR_BORDER, 'sz': 4},
                              left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_rumor, "GOSIP & KABAR BURUNG SEKOLAH (RUMORS & SECRETS)", space_after=1)
    format_run(p.runs[0], font_name="Segoe UI Black", size_pt=7, bold=True, color_rgb=(26, 54, 93))
    p = add_p(c_rumor, "• Rumor tentang dirimu yang beredar di kalangan murid:\n  [                                                                                                                                           ]\n• Rahasia anak lain / klub lain yang kamu ketahui:\n  [                                                                                                                                           ]\n• Gosip asmara paling panas minggu ini:\n  [                                                                                                                                           ]", space_after=8)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=6, color_rgb=(45, 55, 72))

    c_cal = log_table.cell(0, 1)
    set_cell_bg(c_cal, "FFFFFF")
    set_cell_margins(c_cal, top=20, bottom=20, left=30, right=30)
    set_cell_borders(c_cal, top={'color': COLOR_BORDER, 'sz': 4}, bottom={'color': COLOR_BORDER, 'sz': 4},
                            left={'color': COLOR_BORDER, 'sz': 4}, right={'color': COLOR_BORDER, 'sz': 4})
    p = add_p(c_cal, "KALENDER KEGIATAN SMA (EVENT ACADEMIC FLAGS)", space_after=1)
    format_run(p.runs[0], font_name="Segoe UI Black", size_pt=7, bold=True, color_rgb=(155, 44, 44))
    p = add_p(c_cal, "[  ] Upacara Masuk / Pergantian Semester\n[  ] Ujian Tengah Semester (UTS / Midterms)\n[  ] Festival Olahraga (Undoukai)\n[  ] Festival Budaya Sekolah (Bunkasai) — Kesempatan Emas Bikin Kenangan!\n[  ] Study Tour / Perjalanan Sekolah (Shuugakuryokou)\n[  ] Hari Valentine / White Day (Tukar Cokelat & Pengakuan Hati)\n[  ] Ujian Akhir Semester & Liburan Musim Panas (Kembang Api Kuil)", space_after=2)
    format_run(p.runs[0], font_name="Segoe UI", size_pt=6, color_rgb=(45, 55, 72))

    output_path = "/home/nothrovo/Documents/Obsidian Vault/DND/Damsel and Desire/Damsel and Desire - Character Sheet.docx"
    doc.save(output_path)
    print(f"Character sheet saved to: {output_path}")

build_charsheet()
