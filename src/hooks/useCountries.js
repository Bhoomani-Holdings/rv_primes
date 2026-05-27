// hooks/useCountries.js

import {useEffect,useState,} from "react";
import {getCountries,} from "../api/CountriesApi";
export const useCountries = () => {
  const [countries, setCountries] =  useState([]);
  useEffect(() => {

    const fetchCountries =  async () => {
        const data =await getCountries();
        const countryList =data.map((item) => item.country ).filter(Boolean);
        setCountries(countryList);
      };
    fetchCountries();

  }, []);
  return countries;
};