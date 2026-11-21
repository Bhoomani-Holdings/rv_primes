import { getCountryByName } from "./countriesApi.js";

export const getStates = (countryName) => {
  const country = getCountryByName(countryName);
  return country?.regions || [];
};
