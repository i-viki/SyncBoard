/**
 * Uploads a file (any type) to Cloudinary
 * @param {File} file - The File object to upload
 * @returns {Promise<Object>} Cloudinary response (url, bytes, etc.)
 */
export const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    import.meta.env.VITE_APP_CLOUDINARY_CLOUD_UPLOAD_PRESET_NAME;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables missing");
  }

  const payload = new FormData();
  payload.append("file", file);
  payload.append("upload_preset", uploadPreset);
  payload.append("cloud_name", cloudName);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: payload,
    }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();

  return {
    url: data.secure_url || data.url,
    bytes: data.bytes,
    publicId: data.public_id,
    format: data.format,
    resourceType: data.resource_type,
    width: data.width,
    height: data.height,
    createdAt: data.created_at,
    originalFilename: data.original_filename,
  };
};