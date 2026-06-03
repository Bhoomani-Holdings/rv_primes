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
import styles from './BasicInfo.module.css'




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
        <div className={styles.basicContainer}>
            <h2 className={styles.basicTitle}>
                Registration Form
            </h2>

            <p className={styles.basicSubtitle}>
                Please fill in the details below
            </p>

            <div className={styles.basicSection}>
                <div className={styles.sectionHeader}>
                    Basic Details
                </div>

                <div className={styles.basicGrid}>
                    {formData.map((item, index) => {
                        switch (item.tag) {
                            case "select":
                                return (
                                    <Select
                                        key={index}
                                        {...item}
                                        handleChange={handleChange}
                                    />
                                );

                            default:
                                return (
                                    <Input
                                        key={index}
                                        {...item}
                                        handleChange={handleChange}
                                    />
                                );
                        }
                    })}
                </div>
            </div>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.prevBtn}
                    onClick={handlePrev}
                    disabled={isFirstPage}
                >
                    Previous
                </button>

                <button
                    className={styles.nextBtn}
                    onClick={handlesubmit}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
