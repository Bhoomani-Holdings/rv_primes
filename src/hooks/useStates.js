import { useMemo } from "react";
import { getStates } from "../api/statesApi.js";

export const useStates = (country) => {
  const states = useMemo(
    () => getStates(country).map((item) => item.name).filter(Boolean),
    [country]
  );
  return { states, loading: false };
};
