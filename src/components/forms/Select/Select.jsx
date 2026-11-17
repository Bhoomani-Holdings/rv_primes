import React from 'react'
import './Select.css'

export const Select = ({
    label, name, value, error, handleChange, options=[], values, validationRules = []
}) => {
    const isRequired = validationRules.includes("REQUIRED")

    return (
        <div className='select-group'>
            <label htmlFor={name}>
                {label}
                {isRequired && <span className="select-required" aria-hidden="true">*</span>}
            </label>
            <select onChange={handleChange} name={name} value={value} required={isRequired}>
                <option value="">Select</option>
                {
                    options.map((opt, index) => {
                        return <option key={index} value={opt}>{opt}</option>
                    })
                }
            </select>
            {error && <span style={{ color: 'red' }} className='select-error'>{error}</span>}
        </div>
    )
}

