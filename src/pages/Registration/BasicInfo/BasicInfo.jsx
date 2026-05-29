import React, { useEffect, useState } from 'react'
import config from './basicinfoconfigurations.json'

import { validateForm } from '../../Registration/formvalidation.js'
import { useNavigate } from 'react-router-dom'
// import { getCountryCodes } from '../Services/MobileCountryCodes/CountryCodes'
import { Input } from '../../../components/forms/Input/Input.jsx'
import { Select } from '../../../components/forms/Select/Select.jsx'
import { validateField } from '../BasicInfo/basicinfoValidateField.js'
import { saveBasicInfo } from '../../../store/slices/RegistartionSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import './BasicInfo.css'



export default function BasicInfo() {
    const isFirstPage = true;
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // const [formData, setFormData] = useState(config)
    // const [countryCodes, setCountryCodes] = useState([])
    const savedData = useSelector(state => state.registration.basicInfo || {})

    const [formData, setFormData] = useState(() => {
        return config.map(field => ({
            ...field,
            value: savedData[field.name] || field.value || ""
        }))
    })




    //Api call
    // useEffect(() => {

    //     const fetchCountryCodes = async () => {

    //         const data = await getCountryCodes()

    //         setCountryCodes(data)

    //     }

    //     fetchCountryCodes()

    // }, [])


    const handlePrev = () => {

    }

    const handleChange = (event) => {
        validateField(event, formData, setFormData)

    }
    const handlesubmit = () => {
        const { isFormvalid, dataObj, updatedFormData } = validateForm(formData)

        if (!isFormvalid) {
            setFormData(updatedFormData)
            return
        }
        dispatch(saveBasicInfo(dataObj))
        navigate("/address_info");

    }
    return (
        <div className='basic-container'>
            <h2 className='basic-title'>Registration Form</h2>
            <p className="basic-subtitle">
                Please fill in the details below
            </p>
            <div className='basic-section'>
                 <div className='section-header'>Basic Details</div>

            <div className=' basic-grid'> 
            {
                formData.map((item, index) => {
                    // //add country codes to mobile field
                    // if (item.type === "tel") {
                    //     item.countryOptions = countryCodes
                    // }
                    switch (item.tag) {
                        case 'select':
                            return <Select key={index} {...item} handleChange={handleChange} />
                        default:
                            return <Input key={index} {...item} handleChange={handleChange} />
                    }
                })
            }
            </div>
            </div>
            <div className='button-container'>
                <button className='prev-btn' onClick={handlePrev} disabled={isFirstPage}>
                    Previous
                </button>
                <button className="next-btn" onClick={handlesubmit}>Next</button>
            </div>

        </div>
    )
}
