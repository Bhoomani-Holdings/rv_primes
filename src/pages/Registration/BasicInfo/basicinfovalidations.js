export const criteria = {
    "REQUIRED": {
        "regex": /.+/,
        "error": "this feild is required"
    },
    "MOBILE": {
        "regex": /^[0-9]{10}$/,
        "error": "Please enter a valid 10-digit phone number"
    },
    "EMAIL": {
        "regex": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "error": "please enter a valid email address"

    },
    "PASSWORD": {
        "regex": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "error": "Password must contain uppercase, lowercase, number and special character"
    },
    "MATCH_PASSWORD": {
        validate: (value, formData) => {

            if (!value) return true;

            return value === formData.password;
        },

        error: "Passwords do not match"

    },
    "AGE_ABOVE_18": {
        "validate": (value) => {

            if (!value) return false;

            const today = new Date();
            const birthDate = new Date(value);

            const ageInMilliseconds =
                today - birthDate;

            const ageDate =
                new Date(ageInMilliseconds);

            const age =
                Math.abs(
                    ageDate.getUTCFullYear() - 1970
                );

            return age >= 18;
        },

        "error": "Age must be above 18"
    },
}