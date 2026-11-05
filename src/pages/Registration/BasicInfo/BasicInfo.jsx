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
import { resetRegistration } from "../../../store/slices/RegistartionSlice.js";
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

const countryNamesByCallingCode = {
  "1": "United States / Canada and Caribbean",
  "7": "Russia / Kazakhstan",
  "20": "Egypt", "27": "South Africa", "30": "Greece", "31": "Netherlands", "32": "Belgium",
  "33": "France", "34": "Spain", "36": "Hungary", "39": "Italy / Vatican City", "40": "Romania",
  "41": "Switzerland", "43": "Austria", "44": "United Kingdom", "45": "Denmark", "46": "Sweden",
  "47": "Norway", "48": "Poland", "49": "Germany", "51": "Peru", "52": "Mexico", "53": "Cuba",
  "54": "Argentina", "55": "Brazil", "56": "Chile", "57": "Colombia", "58": "Venezuela",
  "60": "Malaysia", "61": "Australia", "62": "Indonesia", "63": "Philippines", "64": "New Zealand",
  "65": "Singapore", "66": "Thailand", "81": "Japan", "82": "South Korea", "84": "Vietnam",
  "86": "China", "90": "Türkiye", "91": "India", "92": "Pakistan", "93": "Afghanistan",
  "94": "Sri Lanka", "95": "Myanmar", "98": "Iran", "211": "South Sudan", "212": "Morocco",
  "213": "Algeria", "216": "Tunisia", "218": "Libya", "220": "Gambia", "221": "Senegal",
  "222": "Mauritania", "223": "Mali", "224": "Guinea", "225": "Côte d’Ivoire", "226": "Burkina Faso",
  "227": "Niger", "228": "Togo", "229": "Benin", "230": "Mauritius", "231": "Liberia",
  "232": "Sierra Leone", "233": "Ghana", "234": "Nigeria", "235": "Chad", "236": "Central African Republic",
  "237": "Cameroon", "238": "Cabo Verde", "239": "São Tomé and Príncipe", "240": "Equatorial Guinea",
  "241": "Gabon", "242": "Republic of the Congo", "243": "Democratic Republic of the Congo", "244": "Angola",
  "245": "Guinea-Bissau", "246": "British Indian Ocean Territory", "247": "Ascension Island", "248": "Seychelles",
  "249": "Sudan", "250": "Rwanda", "251": "Ethiopia", "252": "Somalia", "253": "Djibouti",
  "254": "Kenya", "255": "Tanzania", "256": "Uganda", "257": "Burundi", "258": "Mozambique",
  "260": "Zambia", "261": "Madagascar", "262": "Réunion / Mayotte", "263": "Zimbabwe", "264": "Namibia",
  "265": "Malawi", "266": "Lesotho", "267": "Botswana", "268": "Eswatini", "269": "Comoros",
  "290": "Saint Helena / Tristan da Cunha", "291": "Eritrea", "297": "Aruba", "298": "Faroe Islands",
  "299": "Greenland", "350": "Gibraltar", "351": "Portugal", "352": "Luxembourg", "353": "Ireland",
  "354": "Iceland", "355": "Albania", "356": "Malta", "357": "Cyprus", "358": "Finland",
  "359": "Bulgaria", "370": "Lithuania", "371": "Latvia", "372": "Estonia", "373": "Moldova",
  "374": "Armenia", "375": "Belarus", "376": "Andorra", "377": "Monaco", "378": "San Marino",
  "380": "Ukraine", "381": "Serbia", "382": "Montenegro", "383": "Kosovo", "385": "Croatia",
  "386": "Slovenia", "387": "Bosnia and Herzegovina", "389": "North Macedonia", "420": "Czechia",
  "421": "Slovakia", "423": "Liechtenstein", "500": "Falkland Islands", "501": "Belize", "502": "Guatemala",
  "503": "El Salvador", "504": "Honduras", "505": "Nicaragua", "506": "Costa Rica", "507": "Panama",
  "508": "Saint Pierre and Miquelon", "509": "Haiti", "590": "Guadeloupe / Saint Barthélemy / Saint Martin",
  "591": "Bolivia", "592": "Guyana", "593": "Ecuador", "594": "French Guiana", "595": "Paraguay",
  "596": "Martinique", "597": "Suriname", "598": "Uruguay", "599": "Caribbean Netherlands",
  "670": "Timor-Leste", "672": "Norfolk Island / Australian External Territories", "673": "Brunei",
  "674": "Nauru", "675": "Papua New Guinea", "676": "Tonga", "677": "Solomon Islands", "678": "Vanuatu",
  "679": "Fiji", "680": "Palau", "681": "Wallis and Futuna", "682": "Cook Islands", "683": "Niue",
  "685": "Samoa", "686": "Kiribati", "687": "New Caledonia", "688": "Tuvalu", "689": "French Polynesia",
  "690": "Tokelau", "691": "Micronesia", "692": "Marshall Islands", "850": "North Korea", "852": "Hong Kong",
  "853": "Macau", "855": "Cambodia", "856": "Laos", "880": "Bangladesh", "886": "Taiwan",
  "960": "Maldives", "961": "Lebanon", "962": "Jordan", "963": "Syria", "964": "Iraq", "965": "Kuwait",
  "966": "Saudi Arabia", "967": "Yemen", "968": "Oman", "970": "Palestine", "971": "United Arab Emirates",
  "972": "Israel", "973": "Bahrain", "974": "Qatar", "975": "Bhutan", "976": "Mongolia", "977": "Nepal",
  "992": "Tajikistan", "993": "Turkmenistan", "994": "Azerbaijan", "995": "Georgia", "996": "Kyrgyzstan",
  "998": "Uzbekistan"
};

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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const countries = useCountries();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

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
    if (!showSuccessPopup) return undefined;
    const redirectTimer = window.setTimeout(() => navigate(ROUTES.HOME), 2500);
    return () => window.clearTimeout(redirectTimer);
  }, [showSuccessPopup, navigate]);

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

    const credentials = {
      password: dataObj.password,
      confirmPassword: dataObj.confirmPassword
    };
    const basicInfo = {
      ...Object.fromEntries(
        basicInfoConfig
          .filter(({ name }) => name !== "password" && name !== "confirmPassword")
          .map(({ name }) => [name, dataObj[name]])
      ),
      mobileNumber: `+${countryCode}${dataObj.mobileNumber}`
    };
    const addressInfo = Object.fromEntries(addressInfoConfig.map(({ name }) => [name, dataObj[name]]));

    setSaving(true);
    setSubmitError("");
    try {
      await createUser(basicInfo, addressInfo, credentials);
      dispatch(resetRegistration());
      setFormData((current) => current.map((field) => ({ ...field, value: "", error: "" })));
      setAddressData((current) => current.map((field) => ({ ...field, value: "", error: "" })));
      setCountryCode("91");
      setSaved(true);
      setShowSuccessPopup(true);
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
                      {countryCodes.map((code) => (
                        <option key={code} value={code}>
                          +{code} — {countryNamesByCallingCode[code] || "Other country or territory"}
                        </option>
                      ))}
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
          {saving ? "Submitting..." : saved ? "Submitted" : "Submit"}
        </button>
      </div>
      {submitError && <p role="alert">{submitError}</p>}
      {showSuccessPopup && (
        <div className={styles.successBackdrop}>
          <section className={styles.successDialog} role="dialog" aria-modal="true" aria-labelledby="registration-success-title">
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <h3 id="registration-success-title">Details submitted</h3>
            <p role="status">Your details have been submitted and are waiting for approval.</p>
            <button className={styles.successButton} type="button" onClick={() => navigate(ROUTES.HOME)}>
              Go to Home
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
