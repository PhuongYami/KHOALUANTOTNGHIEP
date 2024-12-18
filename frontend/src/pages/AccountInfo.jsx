import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, updateUser } from '../features/user/userSlice';
import { sendPhoneOTP, verifyPhoneOTP } from '../features/auth/authSlice';
import { toast } from 'sonner';
import ChangePassword from '../components/ChangePassword';
import AvatarUpload from '../components/AvatarUpload';
import { UserCircleIcon, MailIcon, PhoneIcon, CheckCircleIcon, XCircleIcon, BadgeCheckIcon,CameraIcon,  } from 'lucide-react';

const AccountInfo = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.user);
    const authState = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        avatar: '',
        account_type: 'Basic',
        account_status: 'Active',
        is_verified: false,
        is_phone_verified: false,
        thirdPartyVerified: false,
    });

    // Phone Verification State
    const [otpInput, setOtpInput] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: user.avatar || '',
                account_type: user.account_type || 'Basic',
                account_status: user.account_status || 'Active',
                is_verified: user.is_verified || false,
                is_phone_verified: user.is_phone_verified || false,
                thirdPartyVerified: user.thirdPartyVerified || false,
            });
        }
    }, [user]);

    const formatPhoneNumber = (phone) => {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // If the number starts with '0', replace with '+84'
        if (cleaned.startsWith('0')) {
            return `+84${cleaned.slice(1)}`;
        }
        
        // If the number doesn't start with '+84', add it
        if (!cleaned.startsWith('84')) {
            return `+84${cleaned}`;
        }
        
        return `+${cleaned}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateUser(formData)).unwrap();
            toast.success('Account information updated successfully');
        } catch (err) {
            toast.error(err || 'Failed to update account information');
        }
    };

    const handleSendPhoneOTP = async () => {
        try {
            // First, format and update the phone number
            const formattedPhone = formatPhoneNumber(formData.phone);
            
            // Update user with formatted phone number
            await dispatch(updateUser({ ...formData, phone: formattedPhone })).unwrap();
            
            // Then send OTP
            await dispatch(sendPhoneOTP({ phone: formattedPhone })).unwrap();
            
            setShowOtpInput(true);
            toast.success('OTP sent to your phone');
        } catch (error) {
            toast.error(error || 'Failed to send OTP');
        }
    };

    const handleVerifyPhoneOTP = async () => {
        try {
            // Ensure phone is formatted before verification
            const formattedPhone = formatPhoneNumber(formData.phone);
            
            await dispatch(verifyPhoneOTP({ 
                phone: formattedPhone, 
                otpCode: otpInput 
            })).unwrap();
            toast.success('Phone number verified successfully');
            setShowOtpInput(false);
            setOtpInput('');
            // Refresh user data after verification
            dispatch(fetchCurrentUser());
        } catch (error) {
            toast.error(error || 'OTP verification failed');
        }
    };
    const handleAvatarChange = async (newAvatarUrl) => {
        try {
            setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
            await dispatch(updateUser({ ...formData, avatar: newAvatarUrl })).unwrap();
            toast.success('Avatar updated successfully');
        } catch (err) {
            toast.error(err || 'Failed to update avatar');
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Information Section */}
                <div className="md:col-span-2 bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white">Account Information</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Avatar and Verification Section */}
                        <div className="flex items-center space-x-8 relative">
                            {/* Avatar Container */}
                            <div className="relative">
                           {/* Avatar Upload Section */}
                        <AvatarUpload
                            initialAvatar={user?.avatar|| formData.avatar}
                            onAvatarChange={handleAvatarChange}
                            className="w-64 h-64 mx-auto"
                        />
                            </div>

                            {/* Verification Badge Section */}
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center space-x-4">
                                    <BadgeCheckIcon 
                                        className={`w-12 h-12 ${
                                            user?.thirdPartyVerified 
                                            ? 'text-green-600' 
                                            : 'text-gray-400'
                                        }`} 
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Third-Party Verification
                                        </h3>
                                        <p className={`text-sm ${
                                            user?.thirdPartyVerified 
                                            ? 'text-green-600' 
                                            : 'text-red-500'
                                        }`}>
                                            {user?.thirdPartyVerified 
                                                ? 'Verified Account' 
                                                : 'Not Verified'}
                                        </p>
                                    </div>
                                </div>

                                
                                
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <UserCircleIcon className="mr-2 w-5 h-5 text-blue-500" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <MailIcon className="mr-2 w-5 h-5 text-blue-500" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Phone Number Verification */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <PhoneIcon className="mr-2 w-5 h-5 text-blue-500" />
                                    Phone Number
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number (e.g., 0123456789)"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {!user?.is_phone_verified && (
                                        <button
                                            type="button"
                                            onClick={handleSendPhoneOTP}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                                
                                {/* Phone Verification Status */}
                                <div className="flex items-center mt-2">
                                    {user?.is_phone_verified ? (
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                    ) : (
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                                    )}
                                    <span>
                                        {user?.is_phone_verified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* OTP Input */}
                            {showOtpInput && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter OTP
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={otpInput}
                                            onChange={(e) => setOtpInput(e.target.value)}
                                            placeholder="Enter OTP"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVerifyPhoneOTP}
                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Profile Update Button */}
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Change Section */}
                <ChangePassword />
            </div>
        </div>
    );
};

export default AccountInfo;