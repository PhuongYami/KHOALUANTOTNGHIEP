import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changePassword } from '../features/user/userSlice';
import { toast } from 'sonner';
import { LockOpenIcon } from 'lucide-react';

const ChangePassword = () => {
    const dispatch = useDispatch();

    // Local state for form fields
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            await dispatch(changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
            })).unwrap();

            // Reset form after successful password change
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: '',
            });

            toast.success('Password changed successfully');
        } catch (err) {
            toast.error(err || 'Failed to change password');
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Change Password</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <LockOpenIcon className="mr-2 w-5 h-5 text-purple-500" />
                        Current Password
                    </label>
                    <input
                        type="password"
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handleInputChange}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <LockOpenIcon className="mr-2 w-5 h-5 text-purple-500" />
                        New Password
                    </label>
                    <input
                        type="password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                        minLength={8}
                    />
                </div>
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <LockOpenIcon className="mr-2 w-5 h-5 text-purple-500" />
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                        minLength={8}
                    />
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
