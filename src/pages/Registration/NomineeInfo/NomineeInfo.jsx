import React, { useState } from "react"

import { useNavigate } from "react-router-dom"
import NomineeInfoConfiguration from "./NomineeInfoConfiguration.json"
import { validateField } from './NomineeValidateField.js'
import { validateForm } from "../../Registration/formvalidation.js";
import { Input } from "../../../components/forms/Input/Input"
import { Select } from "../../../components/forms/Select/Select"

function NomineeInfo() {

    const navigate = useNavigate()

    const [formData, setFormData] =
        useState(NomineeInfoConfiguration)

    const handleChange = (event) => {

        validateField(
            event,
            formData,
            setFormData
        )
    }
    const previousfn=()=>{
        navigate('/kyc_details')

    }

    const handleSubmit = (e) => {

        e.preventDefault()

        const {
            isFormvalid,
            updatedFormData
        } = validateForm(formData)

        if (!isFormvalid) {

            setFormData(updatedFormData)

            return
        }

        // alert("Submit Successfully")

        // Navigate to next page
        navigate("/bank_details")
    }

    return (

        <form onSubmit={handleSubmit}>

            <h2>Nominee Information</h2>

            {
                formData.map((item, index) => {

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
                })
            }
            <div>
                <button onClick={previousfn}>
                    Previous
                </button>
                <button type="submit">
                    Next
                </button>
            </div>


        </form>
    )
}

export default NomineeInfo