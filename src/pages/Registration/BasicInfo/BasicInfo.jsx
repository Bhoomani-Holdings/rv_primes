import React, { useEffect, useState } from 'react'
import config from './basicinfoconfigurations.json'

import { validateForm } from '../../Registration/formvalidation.js'
import { useNavigate } from 'react-router-dom'
// import { getCountryCodes } from '../Services/MobileCountryCodes/CountryCodes'
import {Input} from '../../../components/forms/Input/Input.jsx'
import {Select} from '../../../components/forms/Select/Select.jsx'
import {validateField} from '../BasicInfo/basicinfoValidateField.js'



export default function BasicInfo() {
    const isFirstPage = true;
    const navigate = useNavigate()
    const [formData, setFormData] = useState(config)
    // const [countryCodes, setCountryCodes] = useState([])


    //Api call
    

    // useEffect(() => {

    //     const fetchCountryCodes = async () => {

    //         const data = await getCountryCodes()

    //         setCountryCodes(data)

    //     }

    //     fetchCountryCodes()

    // }, [])


const handlePrev=()=>{
    
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
        navigate("/address_info");

    }
    return (
        <div>
            <h2>Basic Infromation</h2>
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
            <div>
                <button onClick={handlePrev}  disabled={isFirstPage}>
                Previous
            </button>
            <button onClick={handlesubmit}>Next</button>
            </div>
            
        </div>
    )
}
