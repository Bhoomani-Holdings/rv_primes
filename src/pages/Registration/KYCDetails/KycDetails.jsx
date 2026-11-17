import React, { useState, useEffect } from 'react'
import config from './kycdetailsconfigurations.json'
import { Input } from '../../../components/forms/Input/Input'
import { validateField } from '../KYCDetails/kycfieldvalidate.js'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../routes/routesPath'
import { validateForm } from '../../Registration/formvalidation.js'
import { uploadToCloudinary } from '../../../services/fileUploading/FileUpload'
import { useSelector, useDispatch } from 'react-redux'
import { saveKycInfo } from '../../../store/slices/RegistartionSlice.js'
import { getUsers, submitUserKyc, uploadFacePhoto, faceImageUrl } from '../../../services/userService.js'
import FaceCapture from '../../../components/FaceCapture/FaceCapture'
import { FACE_ANGLES } from '../../../components/FaceCapture/faceAngles'
import styles from './KycDetails.module.css'

export const KycDetails = ({ investorMode = false, onCancel, onInvestorKycSubmitted }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const savedData = useSelector(
        state => state.registration?.kycInfo || {}
    )
    const basicInfo = useSelector(state => state.registration?.basicInfo || {})
    const [investorKycData] = useState(() => {
        if (!investorMode) return {}
        try {
            return JSON.parse(sessionStorage.getItem("investorSession") || "{}").kycDetails || {}
        } catch {
            return {}
        }
    })
    const [investorEmail] = useState(() => {
        if (!investorMode) return ""
        try {
            return JSON.parse(sessionStorage.getItem("investorSession") || "{}").email || ""
        } catch {
            return ""
        }
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")

    // Face photos: { front|left|right: { src, blob?, url?, capturedAt } }
    const [faces, setFaces] = useState(() => {
        const saved = investorMode ? investorKycData.facePhotos || {} : savedData.facePhotos || {}
        return Object.fromEntries(
            FACE_ANGLES.filter(angle => saved[angle.key]?.url).map(angle => [
                angle.key,
                { src: faceImageUrl(saved[angle.key].url), url: saved[angle.key].url, capturedAt: saved[angle.key].capturedAt }
            ])
        )
    })
    const [faceError, setFaceError] = useState("")

    useEffect(() => {
        if (!investorMode || !investorEmail) return undefined

        let cancelled = false
        getUsers()
            .then(users => {
                if (cancelled) return
                const savedKyc = users.find(
                    user => user.email?.toLowerCase() === investorEmail.toLowerCase()
                )?.kycDetails
                const savedPhotos = savedKyc?.facePhotos
                if (!savedPhotos) return

                const restoredFaces = Object.fromEntries(
                    FACE_ANGLES.filter(angle => savedPhotos[angle.key]?.url).map(angle => [
                        angle.key,
                        {
                            src: faceImageUrl(savedPhotos[angle.key].url),
                            url: savedPhotos[angle.key].url,
                            capturedAt: savedPhotos[angle.key].capturedAt
                        }
                    ])
                )
                if (Object.keys(restoredFaces).length === 0) return

                setFaces(current => ({ ...restoredFaces, ...current }))
                setFaceError("")
            })
            .catch(error => {
                if (!cancelled) {
                    setFaceError(`Saved live photo captures could not be loaded: ${error.message}`)
                }
            })

        return () => {
            cancelled = true
        }
    }, [investorMode, investorEmail])

    // Called by the camera window when the user confirms a photo
    const handleFaceCapture = async (angleKey, { blob, url }) => {
        setFaces(current => ({
            ...current,
            [angleKey]: { src: url, blob, capturedAt: new Date().toISOString() }
        }))
        setFaceError("")
    }

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
                    : investorMode
                    ? investorKycData[field.name] || field.value || ""
                        : savedData[field.name] || field.value || "",

            preview:
                field.type === "file"
                    ? investorMode ? investorKycData[field.name] || "" : savedData[field.name] || ""
                    : ""
        }))
    })
    useEffect(() => {
        if (!investorMode && Object.keys(savedData).length > 0) {

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

    }, [investorMode, savedData])

    const handleChange = (event) => {
        validateField(event, formData, setFormData)

    }

    const handleRemoveFile = (fieldName) => {
        setFormData(current => current.map(item =>
            item.name === fieldName
                ? { ...item, value: null, preview: "", error: "" }
                : item
        ))
    }

    const handlePrev = () => {
        if (investorMode) {
            onCancel?.()
            return
        }
        navigate(ROUTES.BASIC_INFO);

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

        const missingFace = FACE_ANGLES.filter(angle => !faces[angle.key])
        if (missingFace.length > 0) {
            setFaceError(`Please capture your ${missingFace.map(angle => angle.label.toLowerCase()).join(", ")} photo${missingFace.length > 1 ? "s" : ""}.`)
        }

        if (!isFormvalid || missingFace.length > 0) {
            setFormData(updatedFormData);
            return;
        }

        try {
            setIsSubmitting(true)
            setSubmitError("")

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
                    ? await uploadToCloudinary(selfieField.value)
                    : selfieField?.preview || "";

            // Face photos: new captures go to our own server, earlier ones are reused
            const facePhotosPayload = {}
            for (const angle of FACE_ANGLES) {
                const face = faces[angle.key]
                facePhotosPayload[angle.key] = face.blob
                    ? await uploadFacePhoto(face.blob)
                    : { url: face.url, capturedAt: face.capturedAt }
            }

            // Final Payload
            const finalData = {

                ...dataObj,

                uploadpancard: panUrl,
                uploadaadhaar: aadhaarUrl,
                uploadaddressproof: addressUrl,
                selfiephoto: selfieUrl,
                facePhotos: facePhotosPayload
            };

            const email = investorMode ? investorEmail : basicInfo.email
            if (!email) throw new Error("Unable to identify the signed-in investor. Please sign in again.")

            dispatch(saveKycInfo(finalData));
            const updatedInvestor = await submitUserKyc(email, finalData)

            if (investorMode) {
                const savedInvestor = JSON.parse(sessionStorage.getItem("investorSession") || "{}")
                const investorSession = {
                    ...savedInvestor,
                    ...updatedInvestor,
                    kycDetails: {
                        ...(updatedInvestor.kycDetails || {}),
                        facePhotos: facePhotosPayload
                    }
                }
                sessionStorage.setItem("investorSession", JSON.stringify(investorSession))
                onInvestorKycSubmitted?.(investorSession)
            } else {
                navigate("/nominee_info");
            }

        } catch (error) {

            setSubmitError(error.message || "Unable to save KYC details")
        } finally {
            setIsSubmitting(false)
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
                                onRemove={item.type === "file"
                                    ? () => handleRemoveFile(item.name)
                                    : undefined}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={`${styles.kycSection} ${styles.faceSection}`}>
                <div className={styles.sectionHeader}>
                    Face Verification
                </div>
                <div className={styles.faceBody}>
                    <FaceCapture
                        title="Live photo capture"
                        photos={faces}
                        onCapture={handleFaceCapture}
                        error={faceError}
                    />
                    <p className={styles.faceConsent}>By continuing, you confirm that you are capturing your own images and consent to their use for this KYC review.</p>
                </div>
            </div>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.prevBtn}
                    onClick={handlePrev}
                >
                    {investorMode ? "Back" : "Previous"}
                </button>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className={styles.nextBtn}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Next"}
                </button>
            </div>
            {submitError && <p role="alert">{submitError}</p>}
        </div>
    )
}
