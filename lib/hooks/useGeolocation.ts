import { useEffect, useState } from "react";

interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

interface UseGeolocationReturn {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  requestLocation: () => void;
}

interface GeolocationPositionError {
  code: number;
  message: string;
}

/**
 * Hook to get user's geolocation
 * @returns Object with position, error, loading state, and requestLocation function
 */
export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by this browser",
      });
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        setPosition({
          latitude: geoPosition.coords.latitude,
          longitude: geoPosition.coords.longitude,
        });
        setLoading(false);
      },
      (geoError) => {
        setError({
          code: geoError.code,
          message: geoError.message,
        });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return {
    position,
    error,
    loading,
    requestLocation,
  };
}

