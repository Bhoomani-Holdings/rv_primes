export const criteria = {

    "REQUIRED": {
        regex: /.+/,
        error: "This field is required"
    },

    "PAN": {
        regex: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
        error: "Please enter valid PAN number"
    },

    "AADHAAR": {
        regex: /^[2-9][0-9]{11}$/,
        error: "Please enter valid Aadhaar number"
    },

    "FILE_UPLOAD": {
        validate: (file) => {

            // optional if REQUIRED handles empty file
            if (!file) return true;

            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "application/pdf",
                "application/x-pdf"
            ];

            const isValidType =
                allowedTypes.includes(file.type);

            const isValidSize =
                file.size <= 5 * 1024 * 1024;

            return (
                isValidType &&
                isValidSize
            );
        },

        error:
            "Upload PNG, JPG, JPEG or PDF under 5MB"
    }

};