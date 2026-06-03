import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from './EarningPreference.module.css'
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
    <div className={styles.earningContainer}>

      <div className={styles.earningHeader}>
        <h2 className={styles.earningTitle}>
          Earning Preference
        </h2>

        <p className={styles.earningSubtitle}>
          Choose how you want to manage your earnings
        </p>
      </div>

      <div className={styles.earningSection}>

        <div className={styles.sectionHeader}>
          Earning Details
        </div>

        <div className={styles.earningGrid}>

          {
            formData.map(item => {

              switch (item.type) {

                case "select":
                  return (
                    <div
                      className={styles.fieldWrapper}
                      key={item.name}
                    >
                      <Select
                        {...item}
                        handleChange={handleChange}
                      />

                      {
                        item.error &&
                        (
                          <span className={styles.errorText}>
                            {item.error}
                          </span>
                        )
                      }
                    </div>
                  );

                case "radio":
                  return (
                    <div
                      key={item.name}
                      className={styles.fieldWrapper}
                    >

                      <p className={styles.fieldLabel}>
                        {item.label}
                      </p>

                      <div className={styles.optionGroup}>
                        {
                          item.options?.map(opt => (
                            <div
                              key={opt}
                              className={styles.toggleCard}
                            >
                              <ToggleField
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
                          <span className={styles.errorText}>
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

      <div className={styles.buttonContainer}>

        <button
          className={styles.prevBtn}
          type="button"
          onClick={previousfn}
        >
          Previous
        </button>

        <button
          className={styles.nextBtn}
          type="button"
          onClick={handleSubmit}
        >
          Submit
        </button>

      </div>

    </div>
  )
}


export default EarningPreference;