import React, { useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import { uploadToCloudinary } from '../api/cloudinary';

const AvatarUpload = ({ onAvatarChange, initialAvatar = null }) => {
    const [avatar, setAvatar] = useState(initialAvatar);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const resizeImage = (file, maxWidth, maxHeight) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target.result;
            };

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;

                // Scale giữ tỷ lệ
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: file.type }));
                        } else {
                            reject(new Error('Image resizing failed'));
                        }
                    },
                    file.type,
                    0.8 // Chất lượng ảnh 80%
                );
            };

            reader.onerror = (error) => reject(error);

            reader.readAsDataURL(file);
        });
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setError(null);
            setIsUploading(true);

            // Resize ảnh
            const resizedFile = await resizeImage(file, 300, 300); // Avatar tối đa 300x300

            // Upload ảnh lên Cloudinary
            const url = await uploadToCloudinary(resizedFile);

            setAvatar(url);
            if (onAvatarChange) {
                onAvatarChange(url);
            }
        } catch (err) {
            console.error('Error uploading avatar:', err);
            setError('Failed to upload avatar. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatar(null);
        if (onAvatarChange) {
            onAvatarChange(null);
        }
    };

    return (
        <section className="mb-8">
            <h3 className="text-xl font-light text-neutral-800 mb-4 flex items-center">
                <Camera className="mr-2 text-neutral-600" />
                Avatar
            </h3>

            {error && (
                <div className="text-red-500 mb-4">
                    {error}
                </div>
            )}

            <div className="relative w-64 h-64 mx-auto">
                {avatar ? (
                    <div className="relative">
                        <img
                            src={avatar}
                            alt="Avatar"
                            className="w-64 h-64 object-cover rounded-full border-4 border-neutral-300 shadow-lg"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <label className="border-4 border-dashed border-neutral-300 rounded-full w-64 h-64 flex items-center justify-center cursor-pointer hover:bg-neutral-100">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        {isUploading ? (
                            <span className="text-neutral-500">Uploading...</span>
                        ) : (
                            <Plus className="text-neutral-500 w-12 h-12" />
                        )}
                    </label>
                )}
            </div>

        </section>
    );
};

export default AvatarUpload;
