/**
 * User profile utility functions
 * Helper functions to manage user profile data in localStorage
 */

export interface UserProfile {
  name: string;
  phoneNumber: string;
  alternativePhones: string[];
  address: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in kilometers, default 5km
  provinceCode?: string; // Selected province code
  provinceName?: string; // Selected province name
  wardCode?: string; // Selected ward code
  wardName?: string; // Selected ward name
  relatives: Relative[];
}

export interface Relative {
  id: string;
  name: string;
  relationship: string; // e.g., "Vợ/Chồng", "Con", "Bố/Mẹ", etc.
  phoneNumber: string;
  address?: string;
}

const PROFILE_KEY = "user_profile";
const DEFAULT_RADIUS = 5; // 5km

/**
 * Get user profile from localStorage
 * @returns UserProfile or null if not found
 */
export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const item = localStorage.getItem(PROFILE_KEY);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading user profile:", error);
    return null;
  }
}

/**
 * Save user profile to localStorage
 * @param profile - UserProfile object to save
 */
export function saveUserProfile(profile: Partial<UserProfile>): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const existing = getUserProfile();
    const updated = {
      ...existing,
      ...profile,
      radius: profile.radius ?? existing?.radius ?? DEFAULT_RADIUS,
      alternativePhones: profile.alternativePhones ?? existing?.alternativePhones ?? [],
      relatives: profile.relatives ?? existing?.relatives ?? [],
    } as UserProfile;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
}

/**
 * Remove user profile from localStorage
 */
export function removeUserProfile(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PROFILE_KEY);
  }
}

/**
 * Get default user profile structure
 */
export function getDefaultProfile(): Partial<UserProfile> {
  return {
    name: "",
    phoneNumber: "",
    alternativePhones: [],
    address: "",
    radius: DEFAULT_RADIUS,
    relatives: [],
    provinceCode: undefined,
    provinceName: undefined,
    wardCode: undefined,
    wardName: undefined,
  };
}

