/**
 * Authentication utility functions
 * Helper functions for token management and authentication checks
 *
 * Note: Tokens are stored permanently in localStorage and will persist
 * until the user explicitly requests account deletion or app uninstallation.
 * There is no automatic logout functionality.
 */

/**
 * Get token from localStorage
 * @returns Token string or null if not found
 */
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  console.log("Token:", localStorage.getItem("token"));
  return localStorage.getItem("token");
}

/**
 * Check if user is authenticated (has token)
 * @returns true if token exists, false otherwise
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Remove token from localStorage
 * Note: This should only be called when user explicitly requests account deletion
 * or when the app is uninstalled. There is no logout functionality.
 */
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

/**
 * Set token in localStorage
 * Token will be stored permanently until explicitly removed by removeToken()
 * @param token - Token string to store
 */
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    // Token is stored permanently - no expiration or automatic logout
    // Only removed when user requests account deletion or app uninstallation
  }
}
