export const criteria = {
  REQUIRED: {
    validate: (value) => {
      if (typeof value === "boolean") return true; // allow true/false
      return value !== "" && value !== null && value !== undefined;
    },
    error: "This field is required"
  }
};