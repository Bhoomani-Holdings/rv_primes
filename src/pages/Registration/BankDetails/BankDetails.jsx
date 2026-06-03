import React, { useState, useEffect } from 'react'
import config from './bankconfigurations.json'
import { Input } from "../../../components/forms/Input/Input"
import { validateField } from './bankfieldvalidate'
import { useNavigate } from 'react-router-dom'
import { validateForm } from '../../Registration/formvalidation'
import { uploadToCloudinary } from '../../../services/fileUploading/FileUpload'
import styles from './BankDetails.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { saveBankInfo } from '../../../store/slices/RegistartionSlice'



export const BankDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const savedData = useSelector(
        state => state.registration?.bankInfo || {}
    )

    const [formData, setFormData] = useState(() => {

        return config.map(field => ({
            ...field,

            value:
                field.type === "file"
                    ? null
                    : savedData[field.name]
                    || field.value
                    || "",

            preview:
                field.type === "file"
                    ? savedData[field.name] || ""
                    : ""
        }))
    })

    useEffect(() => {

        if (Object.keys(savedData).length > 0) {

            const updatedData =
                config.map(field => ({

                    ...field,

                    value:
                        field.type === "file"
                            ? null
                            : savedData[field.name]
                            || field.value
                            || "",

                    preview:
                        field.type === "file"
                            ? savedData[field.name]
                            || ""
                            : ""
                }))

            setFormData(updatedData)
        }

    }, [savedData])

    const handleChange = (event) => {
        validateField(event, formData, setFormData)

    }

    const handlePrev = () => {
        navigate("/nominee_info");

    }
    const handleSubmit = async () => {
        const { isFormvalid, dataObj, updatedFormData } = validateForm(formData)

        if (!isFormvalid) {
            setFormData(updatedFormData)
            return
        }
        try {

            // // Find Cancelled Cheque File
            // const cancelledChequeFile =
            //     formData.find(
            //         item =>
            //             item.name === "cancelledcheque"
            //     )?.value;

            // let chequeUrl = "";

            // // Upload File To Cloudinary
            // if (cancelledChequeFile) {

            //     chequeUrl =
            //         await uploadToCloudinary(
            //             cancelledChequeFile
            //         );
            // }
            // Find cheque field
            const chequeField =
                formData.find(
                    item =>
                        item.name ===
                        "cancelledcheque"
                );

            // Upload OR reuse existing URL
            const chequeUrl =
                chequeField?.value
                    ? await uploadToCloudinary(
                        chequeField.value
                    )
                    : chequeField?.preview || "";


            // Final Payload
            const finalData = {

                ...dataObj,

                cancelledcheque: chequeUrl
            };

            console.log(finalData);
            dispatch(saveBankInfo(finalData))

            //Api CAll
            navigate("/earning_preferences");
        }
        catch (error) {

            console.log(error);

            alert("File Upload Failed");
        }
    }
    
    return (
        <div className={styles.bankContainer}>

            <h2 className={styles.bankTitle}>
                Bank Details
            </h2>

            <p className={styles.bankSubtitle}>
                Enter your bank information
            </p>

            <div className={styles.bankSection}>

                <div className={styles.sectionHeader}>
                    Bank Information
                </div>

                <div className={styles.bankGrid}>
                    {
                        formData.map((item, index) => (
                            <div
                                key={index}
                                className={styles.fieldWrapper}
                            >
                                <Input
                                    {...item}
                                    handleChange={handleChange}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className={styles.buttonContainer}>
                <button
                    onClick={handlePrev}
                    className={styles.prevBtn}
                >
                    Previous
                </button>

                <button
                    onClick={handleSubmit}
                    className={styles.nextBtn}
                >
                    Next
                </button>
            </div>

        </div>
    )
}
