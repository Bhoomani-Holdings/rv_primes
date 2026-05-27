import "./Input.css"

import React, { useMemo, useState, useEffect} from 'react'
import { criteria } from '../../../pages/Registration/BasicInfo/basicinfovalidations'
import { FaEye, FaEyeSlash } from "react-icons/fa"


// export const Input = ({ label, type, placeholder, name, value, error, handleChange, options, values, notes, validationRules = [], countryOptions = [] }) => {

//     const isRequired = validationRules.includes("REQUIRED")
//     const [showPassword, setShowPassword] = useState(false)

//     const inputElement = useMemo(() => {
//         switch (type) {
//             case "text":
//             case "email":
//             // case "password":
//             case "number":
//             case "date":
//                 return <input type={type} id={name} placeholder={placeholder} name={name} value={value} onChange={handleChange} />
//             case "password":

//                 return (
//                     <div className="password-container">

//                         <input
//                             type={
//                                 showPassword
//                                     ? "text"
//                                     : "password"
//                             }
//                             id={name}
//                             placeholder={placeholder}
//                             name={name}
//                             value={value}
//                             onChange={handleChange}
//                         />

//                         <span
//                             className="eye-icon"
//                             onClick={() =>
//                                 setShowPassword(!showPassword)
//                             }
//                         >
//                             {
//                                 showPassword
//                                     ? <FaEyeSlash />
//                                     : <FaEye />
//                             }
//                         </span>

//                     </div>
//                 )
//             // MOBILE WITH COUNTRY CODE
//             // case "tel":
//             //     return (
//             //         <div>

//             //             <select
//             //                 name="countryCode"
//             //                 onChange={handleChange}
//             //             >

//             //                 {
//             //                     countryOptions.map((country, index) => (
//             //                         <option
//             //                             key={index}
//             //                             value={country.value}
//             //                         >
//             //                             {country.label}
//             //                         </option>
//             //                     ))
//             //                 }

//             //             </select>

//             //             <input
//             //                 type="tel"
//             //                 id={name}
//             //                 placeholder={placeholder}
//             //                 name={name}
//             //                 value={value}
//             //                 onChange={handleChange}
//             //             />

//             //         </div>
//             //     )


//             case "file":
//                 return (
//                     <>
//                         <input
//                             type={type}
//                             id={name}
//                             name={name}
//                             accept=".png, .jpg, .jpeg, .pdf"
//                             onChange={handleChange}
//                         />

//                         {
//                             value && (
//                                 <div>

//                                     {/* File Name */}
//                                     <p>{value.name}</p>

//                                     {/* Image Preview */}
//                                     {
//                                         value?.type?.startsWith("image/") && !error && (
//                                             <img
//                                                 src={URL.createObjectURL(value)}
//                                                 alt="Cancelled cheque"
//                                                 width="120"
//                                                 height="120"
//                                             />
//                                         )
//                                     }

//                                     {/* PDF Message */}
//                                     {
//                                         value?.type === "application/pdf" && !error && (
//                                             <p>PDF Uploaded Successfully</p>
//                                         )
//                                     }

//                                 </div>
//                             )
//                         }
//                     </>
//                 )
//             default:
//                 return null
//         }
//     }, [type, options, values, placeholder, name, value, handleChange, showPassword])






//     return (
//         <div>
//             <label htmlFor={name}>
//                 {label}
//                 {isRequired && (
//                     <span style={{ color: "red" }}>*</span>
//                 )}

//             </label>
//             {inputElement}{error && <span style={{ color: "red" }}>{error}</span>}
//             {/* {
//                 notes && (
//                     <small className="notes">{notes}</small>
//                 )
//             } */}

//         </div>
//     )
// }

export const Input = ({
    label,
    type,
    placeholder,
    name,
    value,
    error,
    handleChange,
    validationRules = []
}) => {

    const isRequired =
        validationRules.includes(
            "REQUIRED"
        );

    const [showPassword,
        setShowPassword] =
        useState(false);

    const [previewUrl,
        setPreviewUrl] =
        useState(null);

    // FILE PREVIEW URL
    useEffect(() => {

        if (
            type === "file" &&
            value instanceof File
        ) {

            const url =
                URL.createObjectURL(
                    value
                );

            setPreviewUrl(
                url
            );

            return () =>
                URL.revokeObjectURL(
                    url
                );
        }

    }, [value, type]);

    const inputElement =
        useMemo(() => {

            switch (type) {

                case "text":
                case "email":
                case "number":
                case "date":

                    return (
                        <input
                            type={type}
                            id={name}
                            placeholder={
                                placeholder
                            }
                            name={name}
                            value={value}
                            onChange={
                                handleChange
                            }
                        />
                    );

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
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {
                                    showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                }
                            </span>

                        </div>
                    );

                case "file":

                    return (
                        <>
                            <input
                                type="file"
                                id={name}
                                name={name}
                                accept=".png,.jpg,.jpeg,.pdf"
                                onChange={handleChange}
                            />

                            {
                                value &&
                                !error && (
                                    <div>

                                        <p>
                                            {value.name}
                                        </p>

                                        {/* IMAGE */}
                                        {
                                            value.type?.startsWith(
                                                "image/"
                                            ) && (
                                                <img
                                                    src={previewUrl}
                                                    width="150"
                                                    height="150"
                                                    alt="preview"
                                                />
                                            )
                                        }

                                        {/* PDF */}
                                        {
                                            value.type ===
                                            "application/pdf" && (
                                                <iframe
                                                    src={previewUrl}
                                                    title="pdf"
                                                    width="300"
                                                    height="250"
                                                />
                                            )
                                        }

                                    </div>
                                )
                            }
                        </>
                    );

                default:
                    return null;
            }

        }, [
            type,
            value,
            placeholder,
            name,
            handleChange,
            showPassword,
            previewUrl
        ]);

    return (
        <div>

            <label htmlFor={name}>
                {label}
                {
                    isRequired &&
                    <span
                        style={{
                            color: "red"
                        }}
                    >
                        *
                    </span>
                }
            </label>

            {inputElement}

            {
                error &&
                <span
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </span>
            }

        </div>
    );
};