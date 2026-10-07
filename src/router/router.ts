import { authStore } from "../store/authStore";
import { getUserRoleInCampaign } from "../api/campaigns";
import { showToast } from "../components/Toast";

export type RouteHandler = (params: Record<string, string>) => void | Promise<void>;

interface RouteConfig {
  path: string; // e.g. "/campaigns/:id"
  handler: RouteHandler;
  requiresAuth?: boolean;
  requiresDm?: boolean;
}

class Router {
  private routes: RouteConfig[] = [];
  private notFoundHandler: RouteHandler = () => {};

  private getBasePath(): string {
    const path = window.location.pathname;
    if (path.startsWith("/damsel-and-desire")) {
      return "/damsel-and-desire";
    }
    return "";
  }

  private normalizePath(fullPath: string): string {
    const base = this.getBasePath();
    if (base && fullPath.startsWith(base)) {
      const stripped = fullPath.slice(base.length);
      return stripped ? (stripped.startsWith("/") ? stripped : `/${stripped}`) : "/";
    }
    return fullPath || "/";
  }

  private formatFullPath(appPath: string): string {
    const base = this.getBasePath();
    if (!base) return appPath;
    if (appPath === "/") return `${base}/`;
    return `${base}${appPath.startsWith("/") ? "" : "/"}${appPath}`;
  }

  register(path: string, handler: RouteHandler, options: { requiresAuth?: boolean; requiresDm?: boolean } = {}) {
    this.routes.push({
      path,
      handler,
      requiresAuth: options.requiresAuth,
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
      this.resolve(window.location.pathname);
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

    this.resolve(window.location.pathname);
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
    // Wait for auth to finish loading if it's still initializing
    if (authStore.loading) {
      await new Promise<void>((resolve) => {
        const unsubscribe = authStore.subscribe(() => {
          if (!authStore.loading) {
            unsubscribe();
            resolve();
          }
        });
      });
    }

    const normalizedPath = this.normalizePath(currentPath);
    const pathSegments = normalizedPath.split("/").filter(Boolean);

    for (const route of this.routes) {
      const routeSegments = route.path.split("/").filter(Boolean);
      if (routeSegments.length !== pathSegments.length) continue;

      const params: Record<string, string> = {};
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
        // Route Guard 1: Auth check
        if (route.requiresAuth && !authStore.isAuthenticated()) {
          showToast("Silakan masuk terlebih dahulu untuk mengakses halaman ini.", "warning");
          this.navigate(`/login?redirect=${encodeURIComponent(normalizedPath)}`, true);
          return;
        }

        // Route Guard 2: DM Role check
        if (route.requiresDm && params.campaignId) {
          const role = await getUserRoleInCampaign(params.campaignId);
          if (role !== "dm") {
            showToast("Akses ditolak: Anda bukan Game Master (DM) di campaign ini.", "error");
            this.navigate(`/campaigns/${params.campaignId}`, true);
            return;
          }
        }

        try {
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
