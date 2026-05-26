export const criteria = {
    "REQUIRED": {
        "regex": /.+/,
        "error": "this feild is required"
    },

    "NAME": {
        regex: /^[A-Za-z ]{3,50}$/,
        error: "Please enter valid name"
    },

    "BANK_NAME": {
        regex: /^[A-Za-z0-9 .&()-]{3,50}$/,
        error: "Please enter valid bank name"
    },

    "ACCOUNT_NUMBER": {
        regex: /^[0-9]{9,18}$/,
        error: "Please enter valid account number"
    },

    "IFSC": {
        regex: /^[A-Z]{4}0[A-Z0-9]{6}$/,
        error: "Please enter valid IFSC code"
    },

    "UPI": {
        regex: /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{3,}$/,
        error: "Please enter valid UPI ID"
    },
    "CANCELLED_CHEQUE": {
        validate: (file) => {
            // optional field
            if (!file) return true;

            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "application/pdf",
                "application/x-pdf"

            ];

            const isValidType = allowedTypes.includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024;

            return (isValidType && isValidSize)
        },
        error: "Upload PNG, JPG, JPEG or PDF under 5MB"
    }



}