import sharp from 'sharp';
import cloudinary from '../config/cloudinary.js';

/**
 * Processes an image using Sharp and uploads to Cloudinary
 * @param {Buffer} fileBuffer - The image buffer from Multer
 * @param {string} folder - The Cloudinary folder to upload to
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const processAndUploadImage = async (fileBuffer, folder = 'mmr_amusements') => {
  try {
    // Process image with Sharp
    const processedBuffer = await sharp(fileBuffer)
      .webp({ quality: 80 }) // Compress and convert to WebP
      .toBuffer();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          format: 'webp',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(new Error('Failed to upload image to Cloudinary'));
          }
          resolve(result.secure_url);
        }
      );

      // End stream with processed buffer
      uploadStream.end(processedBuffer);
    });
  } catch (error) {
    console.error('Image Processing Error:', error);
    throw new Error('Failed to process image');
  }
};
