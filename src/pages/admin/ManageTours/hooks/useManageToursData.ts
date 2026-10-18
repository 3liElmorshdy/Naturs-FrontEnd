import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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
  const {
    data: guides = [],
    isLoading: isLoadingGuides,
  } = useQuery({
    queryKey: ["admin", "tourGuides"],
    queryFn: async () => {
      try {
        return await getTourGuides();
      } catch (error) {
        onError(getRequestErrorMessage(error));
        throw error;
      }
    },
    enabled,
  });

  // Local state for tours so ManageTours can perform immediate optimistic updates via setTours
  const [localTours, setLocalTours] = useState<Tour[] | null>(null);

  const {
    data: fetchedTours = [],
    isLoading: isLoadingTours,
  } = useQuery({
    queryKey: ["admin", "tours"],
    queryFn: async () => {
      try {
        return await getAllTours();
      } catch (error) {
        onError(getRequestErrorMessage(error));
        throw error;
      }
    },
    enabled,
  });

  const tours = localTours ?? fetchedTours;

  const setTours: React.Dispatch<React.SetStateAction<Tour[]>> = (action) => {
    setLocalTours((prev) => {
      const current = prev ?? fetchedTours;
      return typeof action === "function" ? action(current) : action;
    });
  };

  return {
    guides,
    tours,
    setTours,
    isLoadingGuides,
    isLoadingTours,
  };
}
