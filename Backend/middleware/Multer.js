import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// ==========================================
// STORAGE ENGINE ENGINE CONFIGURATION
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${uniqueSuffix}${extension}`);
    },
});

// ==========================================
// FILE TYPE VALIDATION FILTER
// ==========================================
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file format. Only JPEG, JPG, PNG, and WEBP formats are allowed!'), false); 
    }
};

// ==========================================
// EXPORTING MULTER INSTANCE MODULE
// ==========================================
export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});
