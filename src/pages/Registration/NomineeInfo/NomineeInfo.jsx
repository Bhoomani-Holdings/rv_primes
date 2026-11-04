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
import { updateUserNomineeDetails } from '../../../services/userService.js'

function NomineeInfo({ investorMode = false, onCancel, onInvestorNomineeSubmitted }) {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Redux saved data
    const savedData = useSelector(
        state => state.registration?.nomineeInfo || {}
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")

    // Load config + redux data
    const [formData, setFormData] = useState(() => {
        return NomineeInfoConfiguration.map(field => ({
            ...field,
            value: investorMode
                ? (() => {
                    try {
                        const investor = JSON.parse(sessionStorage.getItem("investorSession") || "{}")
                        return investor.nomineeDetails?.[field.name] || field.value || ""
                    } catch {
                        return field.value || ""
                    }
                })()
                : savedData[field.name] || field.value || ""
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
        if (investorMode) {
            onCancel?.()
            return
        }
        navigate('/kyc_details')
    }

    // Next
    const handleSubmit = async (e) => {

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

        dispatch(saveNomineeInfo(dataObj))

        if (investorMode) {
            try {
                setIsSubmitting(true)
                setSubmitError("")
                const savedInvestor = JSON.parse(sessionStorage.getItem("investorSession") || "{}")
                if (!savedInvestor.email) throw new Error("Please sign in again to save nominee details.")
                const updatedInvestor = await updateUserNomineeDetails(savedInvestor.email, dataObj)
                const investorSession = { ...savedInvestor, ...updatedInvestor }
                sessionStorage.setItem("investorSession", JSON.stringify(investorSession))
                onInvestorNomineeSubmitted?.(investorSession)
            } catch (error) {
                setSubmitError(error.message || "Unable to save nominee details")
            } finally {
                setIsSubmitting(false)
            }
            return
        }

        navigate('/bank_details')
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={styles.nomineeContainer}
        >

            <h2 className={styles.nomineeTitle}>
                {investorMode ? "Nominee Details" : "Nominee Information"}
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

                {!investorMode && (
                    <button
                        className={styles.prevBtn}
                        type="button"
                        onClick={handlePrev}
                    >
                        Previous
                    </button>
                )}

                <button
                    type="submit"
                    className={styles.nextBtn}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : investorMode ? "Submit nominee details" : "Next"}
                </button>

            </div>
            {submitError && <p role="alert">{submitError}</p>}

        </form>
    )
}

export default NomineeInfo
