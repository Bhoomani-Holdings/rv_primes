import "./Input.css"

import React, { useMemo, useState } from 'react'
import { criteria } from '../../../pages/Registration/BasicInfo/basicinfovalidations'
import { FaEye, FaEyeSlash } from "react-icons/fa"


export const Input = ({ label, type, placeholder, name, value, error, handleChange, options, values, notes, validationRules = [], countryOptions = [] }) => {

    const isRequired = validationRules.includes("REQUIRED")
    const [showPassword, setShowPassword] = useState(false)

    const inputElement = useMemo(() => {
        switch (type) {
            case "text":
            case "email":
            // case "password":
            case "number":
            case "date":
                return <input type={type} id={name} placeholder={placeholder} name={name} value={value} onChange={handleChange} />
            case "password":

                return (
                    <div className="password-container">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            id={name}
                            placeholder={placeholder}
                            name={name}
                            value={value}
                            onChange={handleChange}
                        />

                        <span
                            className="eye-icon"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {
                                showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }
                        </span>

                    </div>
                )
            // MOBILE WITH COUNTRY CODE
            // case "tel":
            //     return (
            //         <div>

            //             <select
            //                 name="countryCode"
            //                 onChange={handleChange}
            //             >

            //                 {
            //                     countryOptions.map((country, index) => (
            //                         <option
            //                             key={index}
            //                             value={country.value}
            //                         >
            //                             {country.label}
            //                         </option>
            //                     ))
            //                 }

            //             </select>

            //             <input
            //                 type="tel"
            //                 id={name}
            //                 placeholder={placeholder}
            //                 name={name}
            //                 value={value}
            //                 onChange={handleChange}
            //             />

            //         </div>
            //     )


            case "file":
                return (
                    <>
                        <input
                            type={type}
                            id={name}
                            name={name}
                            accept=".png, .jpg, .jpeg, .pdf"
                            onChange={handleChange}
                        />

                        {
                            value && (
                                <div>

                                    {/* File Name */}
                                    <p>{value.name}</p>

                                    {/* Image Preview */}
                                    {
                                        value?.type?.startsWith("image/") && !error && (
                                            <img
                                                src={URL.createObjectURL(value)}
                                                alt="Cancelled cheque"
                                                width="120"
                                                height="120"
                                            />
                                        )
                                    }

                                    {/* PDF Message */}
                                    {
                                        value?.type === "application/pdf" && !error && (
                                            <p>PDF Uploaded Successfully</p>
                                        )
                                    }

                                </div>
                            )
                        }
                    </>
                )
            default:
                return null
        }
    }, [type, options, values, placeholder, name, value, handleChange, showPassword])






    return (
        <div>
            <label htmlFor={name}>
                {label}
                {isRequired && (
                    <span style={{ color: "red" }}>*</span>
                )}

            </label>
            {inputElement}{error && <span style={{ color: "red" }}>{error}</span>}
            {/* {
                notes && (
                    <small className="notes">{notes}</small>
                )
            } */}

        </div>
    )
}
