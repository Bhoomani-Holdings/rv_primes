import { criteria } from "./criteria";

export const validateField = (event, formData, setFormData) => {
  const { name, value, type, checked } = event.target;

  const updatedFormData = formData.map((item) => {
    if (item.name === name) {
      let _value = type === "checkbox" ? checked : value;

      let error = "";

      for (const rule of item.validationRules || []) {
        if (criteria[rule]) {
          const isValid = criteria[rule].validate(_value);

          if (!isValid) {
            error = criteria[rule].error;
            break;
          }
        }
      }

      return {
        ...item,
        value: _value,
        error
      };
    }

    return item;
  });

  setFormData(updatedFormData);
};