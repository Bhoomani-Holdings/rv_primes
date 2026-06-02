function ToggleField({ label, name, value, selectedValue, handleChange }) {
  return (
    <label style={{ marginRight: "10px" }}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={selectedValue === value}
        onChange={handleChange}
      />
      {label}
    </label>
  );
}

export default ToggleField;