import React from 'react';
import { Shuffle, X, Star, Heart } from 'lucide-react';

const ProfileActionButtons = ({ onUndo, onSkip, onSuperLike, onLike }) => {
    return (
        <div className="grid grid-cols-4 gap-4 mt-6 p-2">
            <button
                onClick={onUndo}
                className="bg-yellow-100 text-yellow-700 py-3 rounded-full hover:bg-yellow-200 transition flex items-center justify-center"
            >
                <Shuffle size={24} />
            </button>

            <button
                onClick={onSkip}
                className="bg-red-100 text-red-700 py-3 rounded-full hover:bg-red-200 transition flex items-center justify-center"
            >
                <X size={24} />
            </button>
            <button
                onClick={onSuperLike}
                className="bg-purple-100 text-purple-700 py-3 rounded-full hover:bg-purple-200 transition flex items-center justify-center"
            >
                <Star size={24} />
            </button>
            <button
                onClick={onLike}
                className="bg-green-100 text-green-700 py-3 rounded-full hover:bg-green-200 transition flex items-center justify-center"
            >
                <Heart size={24} />
            </button>
        </div>
    );
};

export default ProfileActionButtons;