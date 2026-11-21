import { getCountries } from "../api/countriesApi.js";

const countries = getCountries()
  .map((item) => item.country)
  .filter(Boolean);

export const useCountries = () => countries;
