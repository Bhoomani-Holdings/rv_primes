import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import basicInfoConfig from "./basicinfoconfigurations.json";
import addressInfoConfig from "../AddressInfo/addressinfoconfigurations.json";
import { validateForm } from "../../Registration/formvalidation.js";
import { validateField } from "../BasicInfo/basicinfoValidateField.js";
import { Input } from "../../../components/forms/Input/Input.jsx";
import { Select } from "../../../components/forms/Select/Select.jsx";
import TextArea from "../../../components/forms/TextArea/TextArea.jsx";
import { useCountries } from "../../../hooks/useCountries.js";
import { useStates } from "../../../hooks/useStates.js";
import { createUser } from "../../../services/userService.js";
import { ROUTES } from "../../../routes/routesPath.js";
import { saveAddressInfo, saveBasicInfo } from "../../../store/slices/RegistartionSlice.js";
import styles from "./BasicInfo.module.css";

// Assigned ITU E.164 country and area calling codes. Shared codes such as +1
// and +7 appear once because the selector displays calling codes only.
const countryCodes = [
  "1", "7", "20", "27", "30", "31", "32", "33", "34", "36", "39", "40", "41", "43", "44", "45", "46", "47", "48", "49",
  "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "64", "65", "66", "81", "82", "84", "86",
  "90", "91", "92", "93", "94", "95", "98", "211", "212", "213", "216", "218", "220", "221", "222", "223", "224", "225",
  "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242",
  "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256", "257", "258", "260",
  "261", "262", "263", "264", "265", "266", "267", "268", "269", "290", "291", "297", "298", "299", "350", "351", "352",
  "353", "354", "355", "356", "357", "358", "359", "370", "371", "372", "373", "374", "375", "376", "377", "378", "380",
  "381", "382", "383", "385", "386", "387", "389", "420", "421", "423", "500", "501", "502", "503", "504", "505", "506",
  "507", "508", "509", "590", "591", "592", "593", "594", "595", "596", "597", "598", "599", "670", "672", "673", "674",
  "675", "676", "677", "678", "679", "680", "681", "682", "683", "685", "686", "687", "688", "689", "690", "691", "692",
  "850", "852", "853", "855", "856", "880", "886", "960", "961", "962", "963", "964", "965", "966", "967", "968", "970",
  "971", "972", "973", "974", "975", "976", "977", "992", "993", "994", "995", "996", "998"
].sort((a, b) => Number(a) - Number(b));

export default function BasicInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedBasicInfo = useSelector((state) => state.registration.basicInfo || {});
  const savedAddressInfo = useSelector((state) => state.registration.addressInfo || {});
  const savedCountryCode = countryCodes.find((code) =>
    savedBasicInfo.mobileNumber?.startsWith(`+${code}`)
  ) || "91";
  const [countryCode, setCountryCode] = useState(savedCountryCode);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const countries = useCountries();

  const [formData, setFormData] = useState(() => basicInfoConfig.map((field) => ({
    ...field,
    value: field.name === "mobileNumber" && savedBasicInfo.mobileNumber?.startsWith(`+${savedCountryCode}`)
      ? savedBasicInfo.mobileNumber.slice(savedCountryCode.length + 1)
      : savedBasicInfo[field.name] || field.value || ""
  })));
  const [addressData, setAddressData] = useState(() => addressInfoConfig.map((field) => ({
    ...field,
    value: savedAddressInfo[field.name] || field.value || ""
  })));
  const country = addressData.find((field) => field.name === "country")?.value || "";
  const { states } = useStates(country);

  useEffect(() => {
    if (states.length === 0) return;
    setAddressData((current) => current.map((field) =>
      field.name === "state" && !states.includes(field.value)
        ? { ...field, value: states[0] }
        : field
    ));
  }, [states]);

  const handlePrev = () => navigate(ROUTES.HOME);
  const handleBasicChange = (event) => validateField(event, formData, setFormData);
  const handleAddressChange = (event) => validateField(event, addressData, setAddressData);

  const handleSave = async () => {
    const { isFormvalid, dataObj, updatedFormData } = validateForm([...formData, ...addressData]);
    if (!isFormvalid) {
      setFormData(updatedFormData.slice(0, formData.length));
      setAddressData(updatedFormData.slice(formData.length));
      return;
    }

    const basicInfo = {
      ...Object.fromEntries(basicInfoConfig.map(({ name }) => [name, dataObj[name]])),
      mobileNumber: `+${countryCode}${dataObj.mobileNumber}`
    };
    const addressInfo = Object.fromEntries(addressInfoConfig.map(({ name }) => [name, dataObj[name]]));

    setSaving(true);
    setSubmitError("");
    try {
      await createUser(basicInfo, addressInfo);
      dispatch(saveBasicInfo(basicInfo));
      dispatch(saveAddressInfo(addressInfo));
      setSaved(true);
    } catch (error) {
      setSubmitError(error.message || "Unable to save registration details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.basicContainer}>
      <h2 className={styles.basicTitle}>Registration Form</h2>
      <p className={styles.basicSubtitle}>Please fill in the details below</p>

      <div className={styles.basicSection}>
        <div className={styles.sectionHeader}>Basic Details</div>
        <div className={styles.basicGrid}>
          {formData.map((item) => {
            if (item.name === "mobileNumber") {
              return (
                <div className={styles.mobileField} key={item.name}>
                  <label className={styles.countryCodeLabel} htmlFor="mobile-country-code">
                    Country Code
                    <select
                      id="mobile-country-code"
                      aria-label="Country code"
                      value={countryCode}
                      onChange={(event) => setCountryCode(event.target.value)}
                    >
                      {countryCodes.map((code) => <option key={code} value={code}>+{code}</option>)}
                    </select>
                  </label>
                  <Input {...item} handleChange={handleBasicChange} />
                </div>
              );
            }

            if (item.tag === "select") {
              return <Select key={item.name} {...item} handleChange={handleBasicChange} />;
            }
            return <Input key={item.name} {...item} handleChange={handleBasicChange} />;
          })}
        </div>
      </div>

      <div className={styles.basicSection}>
        <div className={styles.sectionHeader}>Address Details</div>
        <div className={styles.basicGrid}>
          {addressData.map((item) => {
            const updatedItem = {
              ...item,
              options: item.name === "country" ? countries : item.name === "state" ? states : item.options || []
            };
            if (item.type === "textarea") {
              return <TextArea key={item.name} {...updatedItem} onChange={handleAddressChange} />;
            }
            if (item.type === "select") {
              return <Select key={item.name} {...updatedItem} handleChange={handleAddressChange} />;
            }
            return (
              <Input
                key={item.name}
                {...updatedItem}
                type={item.inputType || "text"}
                handleChange={handleAddressChange}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.prevBtn} type="button" onClick={handlePrev}>Previous</button>
        <button className={styles.nextBtn} type="button" onClick={handleSave} disabled={saving || saved}>
          {saving ? "Saving..." : saved ? "Saved" : "Save"}
        </button>
      </div>
      {saved && <p role="status">Your details have been saved.</p>}
      {submitError && <p role="alert">{submitError}</p>}
    </div>
  );
}
