import React, { useState } from 'react'
import config from './bankconfigurations.json'
import { Input } from "../../../components/forms/Input/Input"
import { validateField } from './bankfieldvalidate'
import { useNavigate } from 'react-router-dom'
import { validateForm } from '../../Registration/formvalidation'
import { uploadToCloudinary } from '../../../services/fileUploading/FileUpload'
import './BankDetails.css'
export const BankDetails = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState(config)

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
            navigate("/earning_preferences");
        }
        catch (error) {

            console.log(error);

            alert("File Upload Failed");
        }
    }
    return (
        <div className='basic-container'>
            <h2 className='basic-title'>Bank Details</h2>
            <p className="basic-subtitle">
                Enter your bank information
            </p>

            <div className="basic-section">

                <div className="section-header">
                    Bank Information
                </div>

                <div className="basic-grid">
            {
                formData.map((item, index) => {
                    return <Input key={index} {...item} handleChange={handleChange} />
                })
            }
            </div>
            </div>
            <div className='button-container'>
            <button onClick={handlePrev} className='prev-btn'>
                Previous
            </button>

            <button onClick={handleSubmit} className='next-btn'>
                Next
            </button>
            </div>
            <div>
                {/* <img src='https://res.cloudinary.com/dkkk60cex/image/upload/v1779273103/fg7dlulrmiifjurcwzya.jpg' /> */}
            </div>

        </div>
    )
}
