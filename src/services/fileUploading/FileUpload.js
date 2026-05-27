// export const uploadToCloudinary = async (file) => {

//     if (!file) return "";

//     const data = new FormData();

//     data.append("file", file);

//     data.append(
//         "upload_preset",
//         "documents"
//     );
//       // Folder name in Cloudinary
//     data.append("folder", "registration/cancelled_cheques");

//     const uploadType=file.type==="application/pdf"
//     ?"raw"
//     :"image"

//     const response = await fetch(
//         `https://api.cloudinary.com/v1_1/dhvefnbbm/${uploadType}/upload`,
//         {
//             method: "POST",
//             body: data
//         }
//     );

//     const result = await response.json();
//     console.log(result)

//     return result.secure_url;
// };

export const uploadToCloudinary =
    async (file) => {

    if (!file) return "";

    const data =
        new FormData();

    data.append(
        "file",
        file
    );

    data.append(
        "upload_preset",
        "documents"
    );

    data.append(
        "folder",
        "registration/documents"
    );

    const response =
        await fetch(
            "https://api.cloudinary.com/v1_1/dhvefnbbm/auto/upload",
            {
                method: "POST",
                body: data
            }
        );

    const result =
        await response.json();

    console.log(result);

    return result.secure_url;
};