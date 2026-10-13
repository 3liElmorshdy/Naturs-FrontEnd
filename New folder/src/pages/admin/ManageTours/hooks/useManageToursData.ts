import { useEffect, useState } from "react";

import { getTourGuides } from "../../../../services/adminUsers";
import { getAllTours } from "../../../../services/tourApi";
import type Tour from "../../../../types/Tour";
import type User from "../../../../types/User";
import { getRequestErrorMessage } from "../../../../utils/requestError";

type UseManageToursDataParams = {
  enabled: boolean;
  onError: (message: string) => void;
};

export function useManageToursData({
  enabled,
  onError,
}: UseManageToursDataParams) {
  const [guides, setGuides] = useState<User[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(true);

  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(true);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    async function loadGuides() {
      setIsLoadingGuides(true);

      try {
        const loadedGuides = await getTourGuides();
        setGuides(loadedGuides);
      } catch (error) {
        onError(getRequestErrorMessage(error));
      } finally {
        setIsLoadingGuides(false);
      }
    }

    void loadGuides();
  }, [enabled, onError]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    async function loadTours() {
      setIsLoadingTours(true);

      try {
        const loadedTours = await getAllTours();
        setTours(loadedTours);
      } catch (error) {
        onError(getRequestErrorMessage(error));
      } finally {
        setIsLoadingTours(false);
      }
    }

    void loadTours();
  }, [enabled, onError]);

  return {
    guides,
    tours,
    setTours,
    isLoadingGuides,
    isLoadingTours,
  };
}
