import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import addressConfig from "./addressinfoconfigurations.json";
import { Input } from "../../../components/forms/Input/Input.jsx";
import { Select } from "../../../components/forms/Select/Select.jsx";
import TextArea from "../../../components/forms/TextArea/TextArea.jsx";
import { validateForm } from "../../Registration/formvalidation.js";
import { useCountries } from "../../../hooks/useCountries.js";
import { useStates } from "../../../hooks/useStates.js";
import { validateField } from "./addressInfoValidateField.js";
import { useSelector, useDispatch } from "react-redux";
import { saveAddressInfo } from '../../../store/slices/RegistartionSlice.js'
import styles from './AddressInfo.module.css'

function AddressForm() {
  const navigate = useNavigate();
  // const [formData, setFormData] = useState(addressConfig);
  const savedData = useSelector(
    state => state.registration?.addressInfo || {}
  )
  const dispatch = useDispatch()



  const [formData, setFormData] = useState(() => {
    return addressConfig.map(field => ({
      ...field,
      value: savedData[field.name] || field.value || ""
    }))
  })
  const country =
    formData.find((item) => item.name === "country")?.value;
  const countries = useCountries();

  const { states } = useStates(country);
  useEffect(() => {
    if (states.length > 0) {
      setFormData((prev) =>
        prev.map((field) =>
          field.name === "state"
            ? { ...field, value: states[0] }
            : field
        )
      );
    }
  }, [states]);

  const handleChange = (event) => {
    validateField(event, formData, setFormData);
  };

  const handleNext = () => {
    const { isFormvalid, dataObj, updatedFormData } = validateForm(formData);

    if (!isFormvalid) {
      setFormData(updatedFormData);
      return;
    }
    dispatch(saveAddressInfo(dataObj))
    navigate("/kyc_details");
  };

  const handlePrev = () => {
    navigate("/basic_details");

  }
  return (
    <div className={styles.addressContainer}>
      <h1 className={styles.addressTitle}>
        Address Information
      </h1>

      <p className={styles.addressSubtitle}>
        Please provide your address details
      </p>

      <div className={styles.addressSection}>

        <div className={styles.sectionHeader}>
          Address Details
        </div>

        <div className={styles.addressGrid}>
          {formData.map((item) => {
            let updatedItem = { ...item };

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
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={handlePrev}
          className={styles.prevBtn}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className={styles.nextBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AddressForm;