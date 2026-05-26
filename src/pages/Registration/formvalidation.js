import { criteria } from "../../pages/Registration/BasicInfo/basicinfovalidations.js"
export const validateForm = (formData ) => {
    const dataObj = {}

    // create form values object first
    formData.forEach(item => {
        dataObj[item.name] = item.value
    })

    const updatedFormData = formData.map(item => {

        let error = ""
        for (const rule of item.validationRules) {
            if (criteria[rule]) {

                // REGEX VALIDATION
                if (
                    criteria[rule].regex &&
                    !item.value?.type &&
                    !criteria[rule].regex.test(item.value ||"")
                ) {
                    error = criteria[rule].error
                    break
                }

                // CUSTOM VALIDATION
                if (
                    criteria[rule].validate &&
                    item.value !==null &&
                    item.value!=="" &&
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