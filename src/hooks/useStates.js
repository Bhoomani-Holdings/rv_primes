// hooks/useStates.js

import {useEffect,useState,} from "react";
import {getStates,} from "../api/statesApi";
export const useStates = (country) => {
  const [states, setStates] =useState([]);
  const [loading, setLoading] =useState(false);
  useEffect(() => {
    if (!country) {
      setStates([]);
      return;
    }
    const fetchStates =async () => {
        setLoading(true);
        const data =await getStates(country);
        const stateList =data .map((item) => item.name).filter(Boolean);
        setStates(stateList);
        setLoading(false);
      };
    fetchStates();
  }, [country]);
  return {states, loading,};
};