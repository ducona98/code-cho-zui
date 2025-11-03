import { Outlet, redirect } from "react-router";

import { ROUTES } from "../../../lib/constants/routes";
import { isAuthenticated } from "../../../lib/utils/auth";
import type { Route } from "./+types/layout";

/**
 * Protected Layout - Checks authentication before rendering child routes
 * Redirects to signin if user is not authenticated
 */
export function loader({ request }: Route.LoaderArgs) {
  // Only check on client-side (localStorage is not available on server)
  if (typeof window !== "undefined") {
    const authenticated = isAuthenticated();
    console.log("Protected layout loader - isAuthenticated:", authenticated);

    if (!authenticated) {
      console.log("Protected layout - redirecting to signin");
      // Only redirect if not already on signin page
      if (!request.url.includes(ROUTES.SIGNIN)) {
        return redirect(ROUTES.SIGNIN);
      }
    }
  }

  return null;
}

export default function ProtectedLayout() {
  return <Outlet />;
}
