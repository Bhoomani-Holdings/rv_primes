import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "./earningconfigurations.json";
import ToggleField from "../../../components/forms/Toggle/ToggleField.jsx";
import { Select } from "../../../components/forms/Select/Select.jsx";
import { validateForm } from "../../Registration/formvalidation.js";

function EarningPreference() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(config);

  // HANDLE CHANGE
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) =>
      prev.map((item) =>
        item.name === name
          ? {
              ...item,
              value: value,
              error: ""
            }
          : item
      )
    );
  };

  // SUBMIT
  const handleSubmit = () => {
    const { isFormvalid, dataObj, updatedFormData } =
      validateForm(formData);

    if (!isFormvalid) {
      setFormData(updatedFormData);
      return;
    }

    console.log("FINAL DATA:", dataObj);

    navigate("/");
  };

  return (
    <div>
      <h2>Wallet Preference</h2>

      {formData.map((item) => {
        switch (item.type) {
          case "select":
            return (
              <Select
                key={item.name}
                {...item}
                handleChange={handleChange}
              />
            );

         case "radio":
  return (
    <div key={item.name}>
      <p>{item.label}</p>

      {item.options?.map((opt) => (
        <ToggleField
          key={opt}
          label={opt}
          name={item.name}
          value={opt}
          selectedValue={item.value}
          handleChange={handleChange}
        />
      ))}
    </div>
  );
          default:
            return null;
        }
      })}

      <button onClick={handleSubmit}>Next</button>
    </div>
  );
}

export default EarningPreference;