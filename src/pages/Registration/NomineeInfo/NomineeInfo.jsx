// import React, { useState } from 'react'


// import { useNavigate } from "react-router-dom"
// import NomineeInfoConfiguration from "./NomineeInfoConfiguration.json"
// import { validateField } from './NomineeValidateField.js'
// import { validateForm } from "../../Registration/formvalidation.js";
// import { Input } from "../../../components/forms/Input/Input"
// import { Select } from "../../../components/forms/Select/Select"




// function NomineeInfo () {
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState(NomineeInfoConfiguration)

//   const handleChange = event => {
//     validateField(event, formData, setFormData)
//   }

//   const handleSubmit = e => {
//     e.preventDefault()

//     const { isFormvalid, updatedFormData } = validateForm(formData)

//     if (!isFormvalid) {
//       setFormData(updatedFormData)

//       return
//     }
//     const previousfn=()=>{
//         navigate('/kyc_details')

//     }

//     // alert("Submit Successfully")

//     // Navigate to next page
//     navigate('/')
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Nominee Information</h2>

//       {formData.map((item, index) => {
//         switch (item.type) {
//           case 'select':
//             return <Select key={index} {...item} handleChange={handleChange} />

//           default:
//             return <Input key={index} {...item} handleChange={handleChange} />
//         }
//       })}


//         // alert("Submit Successfully")

//         // Navigate to next page
//         navigate("/bank_details")
    

//     return (

//         <form onSubmit={handleSubmit}>

//             <h2>Nominee Information</h2>

//             {
//                 formData.map((item, index) => {

//                     switch (item.type) {

//                         case "select":

//                             return (
//                                 <Select
//                                     key={index}
//                                     {...item}
//                                     handleChange={handleChange}
//                                 />
//                             )

//                         default:

//                             return (
//                                 <Input
//                                     key={index}
//                                     {...item}
//                                     handleChange={handleChange}
//                                 />
//                             )
//                     }
//                 })
//             }
//             <div>
//                 <button onClick={previousfn} type='button'>
//                     Previous
//                 </button>
//                 <button type="submit">
//                     Next
//                 </button>
//             </div>


//         </form>
//     )

//       <button type='submit'>Submit</button>
//     </form>
//   )
// }

// export default NomineeInfo
import './NomineeInfo.css'
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

        <form onSubmit={handleSubmit} className='basic-container'>

            <h2 className='basic-title'>Nominee Information</h2>
             <p className="basic-subtitle">
            Please provide nominee details
        </p>

        <div className="basic-section">

            <div className="section-header">
                Nominee Details
            </div>

            <div className="basic-grid">

            {
                formData.map((item, index) => {

                    switch (item.type) {

                        case 'select':
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
</div>
</div>
            <div className='button-container'>

                <button className='prev-btn'
                    type="button"
                    onClick={handlePrev}
                >
                    Previous
                </button>

                <button type="submit" className='next-btn'>
                    Next
                </button>

            </div>

        </form>
    )
}

export default NomineeInfo