import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import './EarningPreference.css'
import config from "./earningconfigurations.json";
import ToggleField from "../../../components/forms/Toggle/ToggleField.jsx";
import { Select } from "../../../components/forms/Select/Select.jsx";
import { validateForm } from "../../Registration/formvalidation.js";

import { saveEarningInfo } from "../../../store/slices/RegistartionSlice.js";

function EarningPreference() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux data
  const savedData = useSelector(
    state => state.registration?.earningInfo || {}
  );

  // Form State
  const [formData, setFormData] = useState(() => {
    return config.map(field => ({
      ...field,
      value:
        savedData[field.name] ||
        field.value ||
        ""
    }))
  });

  // Reload redux data
  useEffect(() => {

    if (Object.keys(savedData).length > 0) {

      const updatedData = config.map(field => ({
        ...field,
        value:
          savedData[field.name] ||
          field.value ||
          ""
      }));

      setFormData(updatedData);
    }

  }, [savedData]);

  // Handle Change
  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData(prev =>
      prev.map(item =>
        item.name === name
          ? {
            ...item,
            value,
            error: ""
          }
          : item
      )
    );
  };

  // Previous
  const previousfn = () => {
    navigate('/bank_details')
  }

  // Submit
  const handleSubmit = () => {

    const {
      isFormvalid,
      dataObj,
      updatedFormData
    } = validateForm(formData);

    if (!isFormvalid) {
      setFormData(updatedFormData);
      return;
    }

    console.log(
      "Earning Redux Data",
      dataObj
    );

    // Save Redux
    dispatch(
      saveEarningInfo(
        dataObj
      )
    );

    // Final Submit / API
    navigate("/");
  };

  return (
    <div className="earning-container">
      <div className="earning-header">

        <h2 className="earning-title">
          Earning Preference
        </h2>
        <p className="earning-subtitle">
          Choose how you want to manage your earnings
        </p>
      </div>

      {/* Section */}
      <div className="earning-section">

        <div className="section-header">
          Earning Details
        </div>

        <div className="earning-grid">

          {
            formData.map(item => {

              switch (item.type) {

                case "select":
                  return (
                    <div className="field-wrapper" key={item.name} >
                      {/* <label className="field-label">
                        {item.label}
                      </label> */}

                      <div className="select-wrapper">
                        <Select

                          {...item}
                          handleChange={handleChange}
                        />
                      </div>
                      {
                        item.error &&
                        (
                          <span className="error-text">
                            {item.error}
                          </span>
                        )
                      }
                    </div>
                  );

                case "radio":
                  return (
                    <div key={item.name} className="field-wrapper" >

                      <p className="field-label">
                        {item.label}
                      </p>
                      <div className="option-group">

                        {

                          item.options?.map(opt => (
                            <div
                              key={opt}
                              className="toggle-card"
                            >
                              <ToggleField
                                key={opt}
                                label={opt}
                                name={item.name}
                                value={opt}
                                selectedValue={item.value}
                                handleChange={handleChange}
                              />
                            </div>

                          ))
                        }
                      </div>
                      {
                        item.error &&
                        (
                          <span className="error-text">
                            {item.error}
                          </span>
                        )
                      }
                    </div>
                  );

                default:
                  return null;
              }
            })
          }
        </div>
      </div>
      <div className="button-container">

        <button className="prev-btn"
          type="button"
          onClick={previousfn}
        >
          Previous
        </button>

        <button className="next-btn"
          type="button"
          onClick={handleSubmit}
        >
          Submit
        </button>

      </div>

    </div>
  );
}

export default EarningPreference;