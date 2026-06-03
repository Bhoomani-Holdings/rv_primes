import React, { useState, useEffect } from 'react'
import config from './kycdetailsconfigurations.json'
import { Input } from '../../../components/forms/Input/Input'
import { validateField } from './kycFieldValidate'
import { useNavigate } from 'react-router-dom'
import { validateForm } from '../formvalidation'
import { uploadToCloudinary } from '../../../services/fileUploading/FileUpload'
import { useSelector, useDispatch } from 'react-redux'
import { saveKycInfo } from '../../../store/slices/RegistartionSlice.js'
import './KycDetails.css'

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
        <div className='basic-container'>
            <h2 className='basic-title'>Kyc Details</h2>
            <p className="basic-subtitle">
                Upload and verify your KYC documents
            </p>
            <div className="basic-section">

                <div className="section-header">
                    KYC Information
                </div>
                <div className="basic-grid">
                    {
                        formData.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Input
                                        {...item}
                                        handleChange={handleChange}
                                    />

                                    {/* {
                                        item.type === "file" &&
                                        item.preview &&
                                        (
                                            <div className="file-preview">

                                                {
                                                    item.preview.includes(".pdf")

                                                        ? (
                                                            <iframe
                                                                src={item.preview}
                                                                title="pdf-preview"
                                                                className="preview-pdf"
                                                            />
                                                        )

                                                        : (
                                                            <img
                                                                src={item.preview}
                                                                alt="preview"
                                                                className="preview-image"
                                                            />
                                                        )
                                                }

                                            </div>
                                        )
                                    } */}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='button-container'>
                <button className="prev-btn" onClick={handlePrev}>
                    Previous
                </button>

                <button type="button" onClick={handleSubmit} className='next-btn'>
                    Next
                </button>
            </div>
            <div>
                {/* <img src='https://res.cloudinary.com/dkkk60cex/image/upload/v1779273103/fg7dlulrmiifjurcwzya.jpg' /> */}
            </div>

        </div>
    )
}
