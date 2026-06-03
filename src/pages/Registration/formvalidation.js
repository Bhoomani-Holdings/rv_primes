// import { criteria } from "../../pages/Registration/BasicInfo/basicinfovalidations.js"
// export const validateForm = (formData) => {
//     const dataObj = {}

//     // create form values object first
//     formData.forEach(item => {
//         dataObj[item.name] = item.value
//     })

//     const updatedFormData = formData.map(item => {

//         let error = ""
//         for (const rule of item.validationRules) {
//             if (criteria[rule]) {
//                 // REGEX / FILE VALIDATION
//                 if (criteria[rule].regex) {

//                     // File validation
//                     if (item.type === "file") {

//                         if (!item.value && !item.preview) {
//                             error = criteria[rule].error
//                             break
//                         }
//                     }

//                     // REGEX VALIDATION
//                     else if (
//                         !item.value?.type &&
//                         !criteria[rule].regex.test(item.value || "")
//                     )
//                  {
//             error = criteria[rule].error
//                     break
//                 }
// }

// // CUSTOM VALIDATION
// if (
//     criteria[rule].validate &&
//     item.value !== null &&
//     item.value !== "" &&
//     !criteria[rule].validate(
//         item.value,
//         dataObj
//     )
// ) {
//     error = criteria[rule].error
//     break
// }
//             }
//         }

// return {
//     ...item,
//     error
// }
//     })

// const isFormvalid =
//     updatedFormData.every(
//         item => item.error === ""
//     )

// return {
//     isFormvalid,
//     dataObj,
//     updatedFormData
// }
// }
import { criteria } from "../../pages/Registration/BasicInfo/basicinfovalidations.js"

export const validateForm = (formData) => {

    const dataObj = {}

    // create form values object first
    formData.forEach(item => {
        dataObj[item.name] = item.value
    })

    const updatedFormData = formData.map(item => {

        let error = ""

        for (const rule of item.validationRules) {

            if (criteria[rule]) {

                // FILE + REGEX VALIDATION
                if (criteria[rule].regex) {

                    // File validation
                    if (item.type === "file") {

                        if (!item.value && !item.preview) {
                            error = criteria[rule].error
                            break
                        }
                    }

                    // Text regex validation
                    else if (
                        !item.value?.type &&
                        !criteria[rule].regex.test(item.value || "")
                    ) {
                        error = criteria[rule].error
                        break
                    }
                }

                // CUSTOM VALIDATION
                if (
                    criteria[rule].validate &&
                    item.value !== null &&
                    item.value !== "" &&
                    !criteria[rule].validate(
                        item.value,
                        dataObj
                    )
                ) {
                    error = criteria[rule].error
                    break
                }
            }
        }

        return {
            ...item,
            error
        }
    })

    const isFormvalid =
        updatedFormData.every(
            item => item.error === ""
        )

    return {
        isFormvalid,
        dataObj,
        updatedFormData
    }
}