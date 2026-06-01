import './ToggleField.css'
function ToggleField({ label, name, value, selectedValue, handleChange }) {
  return (
    <label style={{ marginRight: "10px" }} className='toggle-field'>
      <input
        type="radio"
        name={name}
        value={value}
        checked={selectedValue === value}
        onChange={handleChange}
      />
      <span className="toggle-label">{label}</span>
    </label>
  );
}

export default ToggleField;