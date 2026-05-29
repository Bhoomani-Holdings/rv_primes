import React from "react";
import './TextArea.css'

function TextArea({label,name,value,error,onChange,}){

  return (
    <div className="textarea-group">
      <label htmlFor={name}>{label}</label>
      <textarea name={name} value={value} onChange={onChange}/>
      {error && (<span style={{ color: "red" }} className="textarea-error">{error} </span>)}
    </div>
  );
}
export default TextArea;