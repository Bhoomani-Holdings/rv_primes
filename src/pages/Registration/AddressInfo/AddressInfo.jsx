import { useState } from "react";
import { useNavigate } from "react-router-dom";

import addressConfig from "./addressinfoconfigurations.json";
import { Input } from "../../../components/forms/Input/Input.jsx";
import { Select } from "../../../components/forms/Select/Select.jsx";
import TextArea from "../../../components/forms/TextArea/TextArea.jsx";

import { validateForm } from "../../Registration/formvalidation.js";
import { useCountries } from "../../../hooks/useCountries.js";
import { useStates } from "../../../hooks/useStates.js";
import { validateField } from "./addressInfoValidateField.js";

function AddressForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(addressConfig);

  const country =
    formData.find((item) => item.name === "country")?.value;

  const countries = useCountries();
  const { states } = useStates(country);

  const handleChange = (event) => {
    validateField(event, formData, setFormData);
  };

  const handleNext = () => {
    const { isFormvalid, updatedFormData } = validateForm(formData);

    if (!isFormvalid) {
      setFormData(updatedFormData);
      return;
    }

    navigate("/earning_preferences");
  };

  return (
    <div>
      <h1>ADDRESS INFORMATION</h1>

      {formData.map((item) => {
        let updatedItem = { ...item };

        // ✅ FIX: ALWAYS HANDLE OPTIONS SAFELY
        if (item.type === "select") {
          updatedItem.options =
            item.name === "country"
              ? countries
              : item.name === "state"
              ? states
              : item.options || [];
        }

        switch (item.type) {
          case "textarea":
            return (
              <TextArea
                key={item.name}
                {...updatedItem}
                onChange={handleChange}
              />
            );

          case "select":
            return (
              <Select
                key={item.name}
                {...updatedItem}
                handleChange={handleChange}
              />
            );

          default:
            return (
              <Input
                key={item.name}
                {...updatedItem}
                type={item.inputType || "text"}
                handleChange={handleChange}
              />
            );
        }
      })}

      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default AddressForm;