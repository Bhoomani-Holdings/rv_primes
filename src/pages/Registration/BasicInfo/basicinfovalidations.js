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
    "AGE_18_TO_60": {
        validate: (value) => {

            if (!value) return false;

            const today = new Date();
            const birthDate = new Date(value);

            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            // Adjust age if birthday not yet occurred this year
            if (
                monthDifference < 0 ||
                (monthDifference === 0 &&
                    today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            return age >= 18 && age <= 60;
        },

        error: "Age must be between 18 and 60 years"
    }
}