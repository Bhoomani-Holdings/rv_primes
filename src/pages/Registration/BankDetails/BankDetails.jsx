import React, { useState } from 'react'
import config from './bankconfigurations.json'
import { Input } from "../../../components/forms/Input/Input"
import { validateField } from './bankfieldvalidate'
import { useNavigate } from 'react-router-dom'
import { validateForm } from '../../Registration/formvalidation'
import { uploadToCloudinary } from '../../../services/fileUploading/FileUpload'

export const BankDetails = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState(config)

    const handleChange = (event) => {
        validateField(event, formData, setFormData)

    }

    const handlePrev = () => {
        navigate("/");

    }
    const handleSubmit = async () => {
        const { isFormvalid, dataObj, updatedFormData } = validateForm(formData)

        if (!isFormvalid) {
            setFormData(updatedFormData)
            return
        }
        try {

            // Find Cancelled Cheque File
            const cancelledChequeFile =
                formData.find(
                    item =>
                        item.name === "cancelledcheque"
                )?.value;

            let chequeUrl = "";

            // Upload File To Cloudinary
            if (cancelledChequeFile) {

                chequeUrl =
                    await uploadToCloudinary(
                        cancelledChequeFile
                    );
            }

            // Final Payload
            const finalData = {

                ...dataObj,

                cancelledcheque: chequeUrl
            };

            console.log(finalData);

            //Api CAll
            navigate("/kyc_details");
        }
        catch (error) {

            console.log(error);

            alert("File Upload Failed");
        }
    }
    return (
        <div>
            <h2>Bank Details</h2>
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
