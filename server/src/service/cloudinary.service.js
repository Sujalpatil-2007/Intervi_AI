const cloudinary = require("../config/cloudinary");

async function uploadToCloudinary(filePath) {
    return await cloudinary.uploader.upload(filePath, {
        folder: "InterviAI/Resumes",
        resource_type: "raw",
    });
}

async function deleteFromCloudinary(publicId) {
    return await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
    });
}

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};