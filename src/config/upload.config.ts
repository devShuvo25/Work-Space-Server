// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';

// // 1. Setup Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_KEY,
//   api_secret: process.env.CLOUD_SECRET,
// });

// // 2. Setup Storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: 'workspace_media',
//       allowed_formats: ['jpg', 'png', 'pdf'],
//       resource_type: 'auto', // Important: 'auto' allows both images and PDFs
//       public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
//     };
//   },
// });

// export const upload = multer({ storage: storage });
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// 1. Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// 2. Setup Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    const isPDF = file.mimetype === 'application/pdf';
    
    // ফাইল নেম ক্লিন করা (Regex ব্যবহার করে)
    const cleanFileName = file.originalname
      .split('.')[0]
      .replace(/[^a-zA-Z0-9]/g, '_');

    return {
      folder: 'workspace_media',
      // PDF এর জন্য অবশ্যই 'raw' দিতে হবে যাতে ব্রাউজার সরাসরি ফাইল হিসেবে পড়ে
      resource_type: isPDF ? 'raw' : 'image', 
      public_id: `${Date.now()}-${cleanFileName}${isPDF ? '.pdf' : ''}`, // PDF হলে নামের শেষে .pdf যোগ করা
      access_mode: 'public',
    };
  },
});

// 3. File Filter
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    'image/jpeg',    
    'image/jpg',     
    'image/png',     
    'application/pdf' 
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format! Only JPG, JPEG, PNG, and PDF are allowed.'), false);
  }
};

// 4. Export Upload Instance
export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // ১০ মেগাবাইট পর্যন্ত বাড়ানো হয়েছে (PDF এর জন্য ভালো)
  }
});