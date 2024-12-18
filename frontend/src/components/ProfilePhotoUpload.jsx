import React, { useState, useEffect } from 'react';
import { Camera, Plus } from 'lucide-react';
import { uploadToCloudinary } from '../api/cloudinary';

const ProfilePhotoUpload = ({ onPhotoChange, initialPhotos = [] }) => {
    const [photos, setPhotos] = useState(initialPhotos);
    const [error, setError] = useState(null);

    useEffect(() => {
        setPhotos(initialPhotos);
    }, [initialPhotos]);
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
    
                // Scale ảnh giữ tỷ lệ
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
                    0.8 // Chất lượng ảnh (80%)
                );
            };
    
            reader.onerror = (error) => reject(error);
    
            reader.readAsDataURL(file);
        });
    };
    

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
    
        // Prevent uploading more than 6 photos
        if (photos.length + files.length > 6) {
            setError('Maximum 6 photos allowed');
            return;
        }
    
        try {
            setError(null);
    
            // Scale tất cả các ảnh trước khi upload
            const resizedFiles = await Promise.all(
                files.map((file) => resizeImage(file, 800, 800)) // Giới hạn kích thước ảnh là 800x800
            );
    
            const uploadedPhotos = await Promise.all(
                resizedFiles.map(async (file) => {
                    const url = await uploadToCloudinary(file);
                    return { url, uploadedAt: new Date() };
                })
            );
    
            const updatedPhotos = [...photos, ...uploadedPhotos];
            setPhotos(updatedPhotos);
    
            if (onPhotoChange) {
                onPhotoChange(updatedPhotos);
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            setError('Failed to upload photos. Please try again.');
        }
    };
    
    
    const removePhoto = (index) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);
    
        if (onPhotoChange) {
            onPhotoChange(updatedPhotos);
        }
    };
    
    return (
        <section className="mb-8">
            <h3 className="text-xl font-light text-neutral-800 mb-4 flex items-center">
                <Camera className="mr-2 text-neutral-600" /> 
                Profile Photos
            </h3>

            {error && (
                <div className="text-red-500 mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                    <div key={index} className="relative">
                        <img 
                            src={photo.url} 
                            alt={`Photo ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg" 
                        />
                        <button 
                            type="button" 
                            onClick={() => removePhoto(index)} 
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {photos.length < 6 && (
                    <label className="border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center h-24 cursor-pointer hover:bg-neutral-100">
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handlePhotoUpload} 
                            className="hidden" 
                        />
                        <Plus className="text-neutral-500" />
                    </label>
                )}
            </div>
        </section>
    );
};

export default ProfilePhotoUpload;