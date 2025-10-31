import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Route configuration for React Router v7
 * Routes are defined here and mapped to their corresponding route files
 */
export default [
  // Index route (home page)
  index("routes/home.tsx"),

  // Authentication routes
  route("/signin", "routes/signin.tsx"),
  route("/signup", "routes/signup.tsx"),
] satisfies RouteConfig;
