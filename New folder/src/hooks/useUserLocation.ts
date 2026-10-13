import { useState } from "react";

interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export function useUserLocation() {
  const [location, setLocation] =
    useState<UserCoordinates | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  function requestLocation() {
    if (!navigator.geolocation) {
      setError(
        "Your browser does not support location services.",
      );

      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setIsLoading(false);
      },

      (geoError) => {
        if (geoError.code === 1) {
          setError(
            "Location permission was denied. Allow location access to find tours near you.",
          );
        } else if (geoError.code === 3) {
          setError(
            "Finding your location took too long. Please try again.",
          );
        } else {
          setError(
            "We could not determine your location.",
          );
        }

        setIsLoading(false);
      },

      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  }

  function clearLocation() {
    setLocation(null);
    setError(null);
    setIsLoading(false);
  }

  return {
    location,
    isLoading,
    error,
    requestLocation,
    clearLocation,
  };
}