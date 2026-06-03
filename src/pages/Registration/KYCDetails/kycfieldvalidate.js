import { criteria } from './validations';

export const validateField = (
    event,
    formData,
    setFormData
) => {

    const {
        name,
        value,
        type,
        files
    } = event.target;

    const updatedFormData =
        formData.map(item => {

            if (item.name === name) {

                let _value = value;
                let _preview=item._preview || ""

                // FILE INPUT
                if (type === "file") {
                    _value = files[0];

                     // REAL-TIME PREVIEW
                    if (_value) {
                        _preview =
                            URL.createObjectURL(
                                _value
                            );
                    }
                }
                

                // PAN UPPERCASE
                if (name === "pancardnumber") {
                    _value =
                        _value.toUpperCase();
                }

                let error = "";

                for (
                    const rule
                    of item.validationRules
                ) {

                    if (criteria[rule]) {

                        // REGEX VALIDATION
                        if (
                            criteria[rule].regex &&
                            !_value?.type &&
                            !criteria[rule]
                                .regex
                                .test(_value || "")
                        ) {
                            error =
                                criteria[rule]
                                    .error;
                            break;
                        }

                        // FORM VALUES
                        const formValues =
                            Object.fromEntries(
                                formData.map(
                                    field => [
                                        field.name,
                                        field.value
                                    ]
                                )
                            );

                        formValues[name] =
                            _value;

                        // CUSTOM VALIDATION
                        if (
                            criteria[rule]
                                .validate &&
                            !criteria[rule]
                                .validate(
                                    _value,
                                    formValues
                                )
                        ) {
                            error =
                                criteria[rule]
                                    .error;
                            break;
                        }
                    }
                }

                // CLEAR INVALID FILE
                if (
                    error &&
                    type === "file"
                ) {
                    _value = null;
                }

                return {
                    ...item,
                    value: _value,
                    preview:_preview,
                    error
                };
            }

            return item;
        });

    setFormData(updatedFormData);
};