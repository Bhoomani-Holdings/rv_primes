// addressvalidations.js

export const criteria = {
  REQUIRED: {
    regex: /.+/,
    error: "This field is required",
  },

  PINCODE: {
    regex: /^[0-9]{6}$/,
    error: "Pincode must be 6 digits",
  },

};