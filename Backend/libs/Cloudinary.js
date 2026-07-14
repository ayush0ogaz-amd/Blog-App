import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

// Initialize configuration smoothly
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a local file asset securely to a specified Cloudinary folder directory
 * @param {string} localFilePath - Relative or absolute path to the local file
 * @param {string} folderName - Destination folder name on Cloudinary
 */
const FileUploadeToColoudinary = async (localFilePath, folderName) => {
    try {
        // 1. FIXED: Convert relative paths into an absolute path so Cloudinary finds it on disk
        const resolvedPath = path.resolve(localFilePath);

        // Fail early if the developer passed an invalid file track
        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Local file asset not found at path: ${resolvedPath}`);
        }

        // 2. Execute upload step
        const result = await cloudinary.uploader.upload(resolvedPath, {
            folder: folderName,
            resource_type: "auto" // Automatically detects images, raw files, or videos
        });

        return {
            secure_url: result.secure_url,
            public_id: result.public_id // Helpful to store this for future asset updates or deletions!
        };
    } catch (error) {
        // 3. FIXED: Maintain diagnostic transparency instead of stripping down context
        console.error('Cloudinary SDK Network Failure:', error.message || error);
        throw error; 
    }
}

export { FileUploadeToColoudinary };
