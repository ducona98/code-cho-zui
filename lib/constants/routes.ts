/**
 * Route path constants
 * Centralized route definitions for easy maintenance and type safety
 */
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
