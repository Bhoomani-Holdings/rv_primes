import {criteria} from '../BasicInfo/basicinfovalidations'


export const validateField=(event, formData, setFormData)=>{
    const {name, value, type, checked}=event.target
    const updatedFormData=formData.map(item=>{
        if(item.name===name){
            let _value=value
            // Capitalize firstname & lastname
            if(name==="firstname" || name==="lastname"){
                _value=_value
                .split(" ")
                .map(word=>
                    word.charAt(0).toUpperCase()+
                    word.slice(1).toLowerCase()
                )
                .join(" ");
            }
           let error="";
           for(const rule of item.validationRules){
            if(criteria[rule]){
                 // REGEX VALIDATION
                    if (
                        criteria[rule].regex &&
                        !criteria[rule].regex.test(_value)
                    ) {
                        error = criteria[rule].error;
                        break;
                    }
                    const formValues = Object.fromEntries(
                        formData.map(field => [
                            field.name,
                            field.value
                        ])
                    );

                    formValues[name] = _value;

                    if (
                        criteria[rule].validate &&
                        !criteria[rule].validate(
                            _value,
                            formValues
                        )
                    ) {
                        error = criteria[rule].error;
                        break;
                    }

            }
           }
           return {...item, value:_value, error}
        }
        return item
    })
    setFormData(updatedFormData)
}