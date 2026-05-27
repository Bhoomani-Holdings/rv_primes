// api/StateApi.js

import axios from "axios";

export const getStates = async (country) => {

  try {

    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        country,
      }
    );

    return response.data?.data?.states || [];

  } catch (error) {

    console.log(error);

    return [];
  }
};