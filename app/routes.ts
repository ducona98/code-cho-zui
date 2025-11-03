import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Route configuration for React Router v7
 * Routes are defined here and mapped to their corresponding route files
 * Using folder-based structure for better organization and scalability
 */
export default [
  // Authentication routes (public)
  route("/signin", "routes/(public)/signin.tsx"),

  // Protected routes with authentication layout
  route("/", "routes/(protected)/layout.tsx", [
    // Index route (home page) - shows posts list
    index("routes/(protected)/posts/index.tsx"),
    // User settings route - protected
    route("/me", "routes/(protected)/me/index.tsx"),
    // Post detail route - protected
    route("/posts/:id", "routes/(protected)/posts/[id]/index.tsx"),
  ]),
] satisfies RouteConfig;
