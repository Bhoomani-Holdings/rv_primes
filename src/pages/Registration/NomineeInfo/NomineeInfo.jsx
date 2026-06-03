import styles from './NomineeInfo.module.css'
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import NomineeInfoConfiguration from "./NomineeInfoConfiguration.json"
import { validateField } from './NomineeValidateField.js'
import { validateForm } from "../../Registration/formvalidation.js"
import { Input } from "../../../components/forms/Input/Input"
import { Select } from "../../../components/forms/Select/Select"
import { saveNomineeInfo } from '../../../store/slices/RegistartionSlice.js'

function NomineeInfo() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Redux saved data
    const savedData = useSelector(
        state => state.registration?.nomineeInfo || {}
    )

    // Load config + redux data
    const [formData, setFormData] = useState(() => {
        return NomineeInfoConfiguration.map(field => ({
            ...field,
            value: savedData[field.name] || field.value || ""
        }))
    })

    const handleChange = (event) => {
        validateField(
            event,
            formData,
            setFormData
        )
    }

    // Previous
    const handlePrev = () => {
        navigate('/kyc_details')
    }

    // Next
    const handleSubmit = (e) => {

        e.preventDefault()

        const {
            isFormvalid,
            dataObj,
            updatedFormData
        } = validateForm(formData)

        if (!isFormvalid) {
            setFormData(updatedFormData)
            return
        }

        // Save to Redux
        dispatch(saveNomineeInfo(dataObj))

        navigate('/bank_details')
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={styles.nomineeContainer}
        >

            <h2 className={styles.nomineeTitle}>
                Nominee Information
            </h2>

            <p className={styles.nomineeSubtitle}>
                Please provide nominee details
            </p>

            <div className={styles.nomineeSection}>

                <div className={styles.sectionHeader}>
                    Nominee Details
                </div>

                <div className={styles.nomineeGrid}>

                    {formData.map((item, index) => {

                        switch (item.type) {

                            case "select":
                                return (
                                    <Select
                                        key={index}
                                        {...item}
                                        handleChange={handleChange}
                                    />
                                )

                            default:
                                return (
                                    <Input
                                        key={index}
                                        {...item}
                                        handleChange={handleChange}
                                    />
                                )
                        }
                    })}
                </div>
            </div>

            <div className={styles.buttonContainer}>

                <button
                    className={styles.prevBtn}
                    type="button"
                    onClick={handlePrev}
                >
                    Previous
                </button>

                <button
                    type="submit"
                    className={styles.nextBtn}
                >
                    Next
                </button>

            </div>

        </form>
    )
}

export default NomineeInfo