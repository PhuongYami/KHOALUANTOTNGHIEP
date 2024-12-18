// src/api/cloudinary.js
export const uploadToCloudinary = async (file) =>
{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET); // Thay bằng upload preset của bạn
    formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME); // Thay bằng cloud name của bạn

    try
    {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${ process.env.REACT_APP_CLOUDINARY_CLOUD_NAME }/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok)
        {
            throw new Error('Failed to upload image to Cloudinary');
        }

        const data = await response.json();
        return data.secure_url; // URL của ảnh sau khi upload thành công
    } catch (error)
    {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};
