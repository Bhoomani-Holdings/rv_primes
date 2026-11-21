import { allCountries } from "country-region-data";

const countryData = allCountries.map(([countryName, , regions = []]) => ({
  countryName,
  regions: regions.map(([name, shortCode]) => ({ name, shortCode }))
}));

const countriesByName = new Map(
  countryData.map((country) => [country.countryName.trim().toLocaleLowerCase(), country])
);

export const getCountries = () =>
  countryData.map(({ countryName }) => ({ country: countryName }));

export const getCountryByName = (countryName) => {
  if (!countryName) return undefined;
  return countriesByName.get(countryName.trim().toLocaleLowerCase());
};
