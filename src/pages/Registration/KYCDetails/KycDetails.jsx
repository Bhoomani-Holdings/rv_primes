import React, { useState, useEffect } from 'react'
import config from './kycdetailsconfigurations.json'
import { Input } from '../../../components/forms/Input/Input'
import { validateField } from './kycFieldValidate'
import { useNavigate } from 'react-router-dom'
import { validateForm } from '../formvalidation'
import { uploadToCloudinary } from '../../../services/fileUploading/FileUpload'
import { useSelector, useDispatch } from 'react-redux'
import { saveKycInfo } from '../../../store/slices/RegistartionSlice.js'
import styles from './KycDetails.module.css'

export const KycDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const savedData = useSelector(
        state => state.registration?.kycInfo || {}
    )
    console.log(savedData);

    // const [formData, setFormData] = useState(config)
    // const [formData, setFormData] = useState(() => {
    //     return config.map(field => ({
    //         ...field,
    //         value: savedData[field.name] || field.value || ""
    //     }))
    // })

    const [formData, setFormData] = useState(() => {
        return config.map(field => ({
            ...field,
            value:
                field.type === "file"
                    ? null
                    : savedData[field.name] || field.value || "",

            preview:
                field.type === "file"
                    ? savedData[field.name] || ""
                    : ""
        }))
    })
    useEffect(() => {

        if (Object.keys(savedData).length > 0) {

            const updatedData = config.map(field => ({
                ...field,

                value:
                    field.type === "file"
                        ? null
                        : savedData[field.name] || field.value || "",

                preview:
                    field.type === "file"
                        ? savedData[field.name] || ""
                        : ""
            }))

            setFormData(updatedData)
        }

    }, [savedData])

    const handleChange = (event) => {
        validateField(event, formData, setFormData)

    }

    const handlePrev = () => {
        navigate("/address_info");

    }
    // const handleSubmit = async () => {
    //     const { isFormvalid, dataObj, updatedFormData } = validateForm(formData)

    //     if (!isFormvalid) {
    //         setFormData(updatedFormData)
    //         return
    //     }
    //     try {

    //         // Find Cancelled Cheque File
    //         const cancelledChequeFile =
    //             formData.find(
    //                 item =>
    //                     item.name === "cancelledcheque"
    //             )?.value;

    //         let chequeUrl = "";

    //         // Upload File To Cloudinary
    //         if (cancelledChequeFile) {

    //             chequeUrl =
    //                 await uploadToCloudinary(
    //                     cancelledChequeFile
    //                 );
    //         }

    //         // Final Payload
    //         const finalData = {

    //             ...dataObj,

    //             cancelledcheque: chequeUrl
    //         };

    //         console.log(finalData);

    //         //Api CAll
    //         navigate("/dashboard");
    //     }
    //     catch (error) {

    //         console.log(error);

    //         alert("File Upload Failed");
    //     }
    // }
    const handleSubmit = async () => {

        const {
            isFormvalid,
            dataObj,
            updatedFormData
        } = validateForm(formData);

        if (!isFormvalid) {
            setFormData(updatedFormData);
            return;
        }

        try {

            // Find Fields
            const panField = formData.find(
                item => item.name === "uploadpancard"
            );

            const aadhaarField = formData.find(
                item => item.name === "uploadaadhaar"
            );

            const addressField = formData.find(
                item => item.name === "uploadaddressproof"
            );

            const selfieField = formData.find(
                item => item.name === "selfiephoto"
            );

            // Upload or Reuse Existing URLs
            const panUrl =
                panField?.value
                    ? await uploadToCloudinary(
                        panField.value
                    )
                    : panField?.preview || "";

            const aadhaarUrl =
                aadhaarField?.value
                    ? await uploadToCloudinary(
                        aadhaarField.value
                    )
                    : aadhaarField?.preview || "";

            const addressUrl =
                addressField?.value
                    ? await uploadToCloudinary(
                        addressField.value
                    )
                    : addressField?.preview || "";

            const selfieUrl =
                selfieField?.value
                    ? await uploadToCloudinary(
                        selfieField.value
                    )
                    : selfieField?.preview || "";

            // Final Payload
            const finalData = {

                ...dataObj,

                uploadpancard: panUrl,
                uploadaadhaar: aadhaarUrl,
                uploadaddressproof: addressUrl,
                selfiephoto: selfieUrl
            };

            console.log("Final Data", finalData);

            dispatch(saveKycInfo(finalData));

            navigate("/nominee_info");

        } catch (error) {

            console.log(error);

            alert("File Upload Failed");
        }
    };
    return (
        <div className={styles.kycContainer}>
            <h2 className={styles.kycTitle}>
                Kyc Details
            </h2>

            <p className={styles.kycSubtitle}>
                Upload and verify your KYC documents
            </p>

            <div className={styles.kycSection}>

                <div className={styles.sectionHeader}>
                    KYC Information
                </div>

                <div className={styles.kycGrid}>
                    {formData.map((item, index) => (
                        <div
                            key={index}
                            className={styles.fieldWrapper}
                        >
                            <Input
                                {...item}
                                handleChange={handleChange}
                            />

                            {item.type === "file" &&
                                item.preview && (
                                    <div className={styles.filePreview}>

                                        {item.preview.includes(".pdf")
                                            ? (
                                                <iframe
                                                    src={item.preview}
                                                    title="pdf-preview"
                                                    className={styles.previewPdf}
                                                />
                                            )
                                            : (
                                                <img
                                                    src={item.preview}
                                                    alt="preview"
                                                    className={styles.previewImage}
                                                />
                                            )}
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.prevBtn}
                    onClick={handlePrev}
                >
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className={styles.nextBtn}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
