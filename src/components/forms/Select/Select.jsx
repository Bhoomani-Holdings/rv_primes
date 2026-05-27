import React from 'react'
import './Select.css'

export const Select = ({
    label, name, value, error, handleChange, options=[], values
}) => {
    return (
        <div>
            <label htmlFor={name} >{label}</label>
            <select onChange={handleChange} name={name} value={value}>
                <option value="">Select</option>
                {
                    options.map((opt, index) => {
                        return <option key={index} value={opt}>{opt}</option>
                    })
                }
            </select>
            {error && <span style={{ color: 'red' }}>{error}</span>}
        </div>
    )
}

