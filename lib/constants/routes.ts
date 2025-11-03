/**
 * Route path constants
 * Centralized route definitions for easy maintenance and type safety
 */
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  ME: "/me",
  POST_DETAIL: (id: string) => `/posts/${id}`,
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
