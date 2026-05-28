// validateField.js

import { criteria } from "./addressInfoValidations";

export const validateField = (event,formData,setFormData) => {
  const { name, value } = event.target;
  const updatedFormData = formData.map((item) => {
    if (item.name === name) {
      let _value = value;
      let error = "";
      // LOOP VALIDATION RULES
      for (const rule of item.validationRules) {
        if (criteria[rule]) {
          // REGEX VALIDATION
          if ( criteria[rule].regex && !criteria[rule].regex.test(_value) ) {
            error = criteria[rule].error;
 break;
          }
          // CUSTOM VALIDATION
          if (  criteria[rule].validate && !criteria[rule].validate(_value)) {
            error = criteria[rule].error;
            break;
          }
        }
      }

      return {...item,value: _value,error, };
    }
    return item;
  });

  setFormData(updatedFormData);
};