import React from "react";

function TextArea({label,name,value,error,onChange,}){

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <textarea name={name} value={value} onChange={onChange}/>
      {error && (<span style={{ color: "red" }}>{error} </span>)}
    </div>
  );
}
export default TextArea;