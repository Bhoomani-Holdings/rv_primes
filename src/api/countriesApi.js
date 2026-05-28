// api/CountryApi.js

import axios from "axios";

export const getCountries = async () => {

  try {

    const response = await axios.get(
      "https://countriesnow.space/api/v0.1/countries"
    );

    return response.data?.data || [];

  } catch (error) {

    console.log(error);

    return [];
  }
};