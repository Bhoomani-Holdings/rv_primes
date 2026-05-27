import React, { useState } from 'react'
import config from './kycdetailsconfigurations.json'
import { Input } from '../../../components/forms/Input/Input'
import { validateField } from './kycFieldValidate'
import { useNavigate } from 'react-router-dom'
import { validateForm } from '../formvalidation'
import { uploadToCloudinary } from '../../../services/fileUploading/FileUpload'

export const KycDetails = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState(config)

    const handleChange = (event) => {
        validateField(event, formData, setFormData)

    }

    const handlePrev = () => {
        navigate("/");

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

        // Find Files
        const panFile =
            formData.find(
                item =>
                    item.name ===
                    "uploadpancard"
            )?.value;

        const aadhaarFile =
            formData.find(
                item =>
                    item.name ===
                    "uploadaadhaar"
            )?.value;

        const addressFile =
            formData.find(
                item =>
                    item.name ===
                    "uploadaddressproof"
            )?.value;

        const selfieFile =
            formData.find(
                item =>
                    item.name ===
                    "selfiephoto"
            )?.value;

        // Upload Files
        const panUrl =
            panFile
                ? await uploadToCloudinary(
                    panFile
                )
                : "";

        const aadhaarUrl =
            aadhaarFile
                ? await uploadToCloudinary(
                    aadhaarFile
                )
                : "";

        const addressUrl =
            addressFile
                ? await uploadToCloudinary(
                    addressFile
                )
                : "";

        const selfieUrl =
            selfieFile
                ? await uploadToCloudinary(
                    selfieFile
                )
                : "";

        // Final Payload
        const finalData = {

            ...dataObj,

            uploadpancard:
                panUrl,

            uploadaadhaar:
                aadhaarUrl,

            uploadaddressproof:
                addressUrl,

            selfiephoto:
                selfieUrl
        };

        console.log(
            finalData
        );

        navigate(
            "/"
        );

    } catch (error) {

        console.log(error);

        alert(
            "File Upload Failed"
        );
    }
};
    return (
        <div>
            <h2>Kyc Details</h2>
            {
                formData.map((item, index) => {
                    return <Input key={index} {...item} handleChange={handleChange} />
                })
            }
            <button onClick={handlePrev}>
                Previous
            </button>

            <button onClick={handleSubmit}>
                Submit
            </button>
            <div>
                {/* <img src='https://res.cloudinary.com/dkkk60cex/image/upload/v1779273103/fg7dlulrmiifjurcwzya.jpg' /> */}
            </div>

        </div>
    )
}
