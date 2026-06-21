import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Initialize Cloudinary
// (We should use environment variables ideally, but since we're in AI Studio without them, we will use it with process.env properties mapped later, or use mock if missing)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_api_secret',
});

export const uploadToCloudinary = (fileBuffer: Buffer, folder: string, resourceType: string = 'auto'): Promise<any> => {
  return new Promise((resolve, reject) => {
    // If not configured, mock success for preview env
    if (process.env.CLOUDINARY_CLOUD_NAME === undefined) {
      console.warn("Using mock cloudinary upload because env vars are missing");
      resolve({
        secure_url: 'https://via.placeholder.com/800x600.png?text=Mock+Upload',
        public_id: 'mock_' + Date.now(),
        format: 'mock',
        bytes: fileBuffer.length
      });
      return;
    }

    const cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType as any,
      },
      (error: any, result: any) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
   if (process.env.CLOUDINARY_CLOUD_NAME === undefined) return;
   return cloudinary.uploader.destroy(publicId);
};
