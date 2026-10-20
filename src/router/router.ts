import { getUserRoleInCampaign } from "../api/campaigns";
import { showToast } from "../components/Toast";
import { dmAuthStore } from "../store/dmAuthStore";

export type RouteHandler = (params: Record<string, string>) => void | Promise<void>;

interface RouteConfig {
  path: string; // e.g. "/campaigns/:id"
  handler: RouteHandler;
  requiresDm?: boolean; // hanya untuk route DM dashboard
}

class Router {
  private routes: RouteConfig[] = [];
  private notFoundHandler: RouteHandler = () => {};
  private onRouteChangeCallbacks: Array<(path: string) => void> = [];

  onRouteChange(cb: (path: string) => void) {
    this.onRouteChangeCallbacks.push(cb);
    return this;
  }

  private getBasePath(): string {
    const path = window.location.pathname;
    if (path.startsWith("/damsel-and-desire")) {
      return "/damsel-and-desire";
    }
    return "";
  }

  private normalizePath(fullPath: string): string {
    const base = this.getBasePath();
    const [pathPart, searchPart] = fullPath.split("?");
    let stripped = pathPart;
    if (base && pathPart.startsWith(base)) {
      stripped = pathPart.slice(base.length);
      stripped = stripped ? (stripped.startsWith("/") ? stripped : `/${stripped}`) : "/";
    }
    if (!stripped) stripped = "/";
    return searchPart !== undefined ? `${stripped}?${searchPart}` : stripped;
  }

  private formatFullPath(appPath: string): string {
    const base = this.getBasePath();
    const [pathPart, searchPart] = appPath.split("?");
    let full = pathPart;
    if (base) {
      if (pathPart === "/") full = `${base}/`;
      else full = `${base}${pathPart.startsWith("/") ? "" : "/"}${pathPart}`;
    }
    return searchPart !== undefined ? `${full}?${searchPart}` : full;
  }

  register(path: string, handler: RouteHandler, options: { requiresDm?: boolean } = {}) {
    this.routes.push({
      path,
      handler,
      requiresDm: options.requiresDm
    });
    return this;
  }

  setNotFound(handler: RouteHandler) {
    this.notFoundHandler = handler;
    return this;
  }

  init() {
    window.addEventListener("popstate", () => {
      this.resolve(window.location.pathname + window.location.search);
    });

    // Intercept internal link clicks
    document.addEventListener("click", (e) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (
        href &&
        (href.startsWith("/") || href.startsWith("./")) &&
        !href.startsWith("//") &&
        !target.hasAttribute("download") &&
        target.getAttribute("target") !== "_blank"
      ) {
        e.preventDefault();
        const appPath = this.normalizePath(href);
        this.navigate(appPath);
      }
    });

    this.resolve(window.location.pathname + window.location.search);
  }

  navigate(path: string, replace: boolean = false) {
    const normalized = this.normalizePath(path);
    const fullUrl = this.formatFullPath(normalized);
    if (replace) {
      window.history.replaceState({}, "", fullUrl);
    } else {
      window.history.pushState({}, "", fullUrl);
    }
    this.resolve(normalized);
  }

  async resolve(currentPath: string) {
    const [pathPart, searchPart] = currentPath.split("?");
    const normalizedPath = this.normalizePath(pathPart);
    const pathSegments = normalizedPath.split("/").filter(Boolean);

    // Extract query parameters from search string
    const queryParams: Record<string, string> = {};
    const searchToParse = searchPart !== undefined ? searchPart : window.location.search.replace(/^\?/, "");
    if (searchToParse) {
      const searchParams = new URLSearchParams(searchToParse);
      searchParams.forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    for (const route of this.routes) {
      const routeSegments = route.path.split("/").filter(Boolean);
      if (routeSegments.length !== pathSegments.length) continue;

      const params: Record<string, string> = { ...queryParams };
      let match = true;

      for (let i = 0; i < routeSegments.length; i++) {
        if (routeSegments[i].startsWith(":")) {
          const paramName = routeSegments[i].slice(1);
          params[paramName] = decodeURIComponent(pathSegments[i]);
        } else if (routeSegments[i] !== pathSegments[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        // DM Dashboard: hanya bisa diakses kalau dmAuthStore aktif
        if (route.requiresDm) {
          if (!dmAuthStore.isDmActive()) {
            showToast("Halaman ini hanya tersedia untuk Game Master aktif.", "warning");
            const campaignId = params.campaignId || params.id;
            this.navigate(campaignId ? `/campaigns/${campaignId}` : "/campaigns", true);
            return;
          }
          // Verifikasi role DM di campaign
          const campaignId = params.campaignId || params.id;
          const role = campaignId ? await getUserRoleInCampaign(campaignId) : null;
          if (role !== "dm") {
            showToast("Halaman ini hanya tersedia untuk Game Master campaign.", "warning");
            this.navigate(campaignId ? `/campaigns/${campaignId}` : "/campaigns", true);
            return;
          }
        }

        try {
          this.onRouteChangeCallbacks.forEach((cb) => {
            try { cb(normalizedPath); } catch (e) { console.warn("Router listener error:", e); }
          });
          await route.handler(params);
        } catch (err: any) {
          console.error("Router execution error:", err);
          showToast(`Terjadi kesalahan saat memuat halaman: ${err.message}`, "error");
        }
        return;
      }
    }

    // No match: 404
    this.notFoundHandler({});
  }
}

export const router = new Router();
