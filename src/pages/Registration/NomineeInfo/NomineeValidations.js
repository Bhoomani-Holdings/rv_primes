export const criteria = {

    REQUIRED: {
        validate: (value) => value?.trim() !== "",
        error: "This field is required"
    },

    USER_NAME: {
        regex: /^[A-Za-z ]{3,}$/,
        error: "Name must contain only letters and spaces"
    },

    MOBILE_NUMBER: {
        regex: /^[6-9][0-9]{9}$/,
        error:
            "Mobile number must start with 6,7,8,9 and contain 10 digits"
    }

}