import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfileById } from '../features/user/userSlice';
import {
    MapPin, Briefcase, GraduationCap, Heart, Camera,
    Cigarette, Wine, Users, Ruler, Diamond, Baby, HomeIcon,
} from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { createOrGetMatchApi,getMatchStatus, respondToMatchRequest } from '../api/matchingApi.js';
import { createOrGetConversationApi } from '../api/messageApi.js';
import { toast } from 'sonner';

const UserProfile = () => {
    const { userId } = useParams(); // Get user ID from URL
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [matchStatus, setMatchStatus] = useState(null); // Match status: null, Pending, Accepted, Rejected
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [avatar, setAvatar] = useState("");
    const dispatch = useDispatch();
    const { userId: currentUserId } = useSelector(state => state.user);
    const [matchDetails, setMatchDetails] = useState(null);


    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const profileResponse = await dispatch(fetchUserProfileById(userId)).unwrap();
    
                if (profileResponse) {
                    setUserProfile(profileResponse.profile);
                    setAvatar(profileResponse.avatar);
                } else {
                    console.error('No profile found');
                    setError(new Error('Profile not found'));
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
    
        const checkMatchStatus = async () => {
            try {
                // Only fetch match status if both users are different
                if (currentUserId && currentUserId !== userId) {
                    const response = await getMatchStatus(currentUserId, userId);
                    
                    if (response.status && response.status !== 'No Match') {
                        setMatchDetails(response);
                        
                        // Xác định trạng thái hiển thị
                        if (response.match.user1 === currentUserId) {
                            // Người dùng hiện tại là người gửi (user1)
                            setMatchStatus(response.status === 'Pending' ? 'Pending' : null);
                        } else {
                            // Người dùng hiện tại là người nhận (user2)
                            setMatchStatus(response.status === 'Pending' ? 'RespondToRequest' : null);
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking match status:", error);
            }
        };
    
        if (userId) {
            loadUserProfile();
            checkMatchStatus();
        }
    }, [userId, currentUserId, dispatch]);

    // Xử lý chấp nhận yêu cầu kết nối
    const handleAccept = async () => {
        try {
            // Gửi yêu cầu chấp nhận kết nối
            const response = await respondToMatchRequest(matchDetails.match._id, 'Matched');
            if (response?.conversationId) {
                setMatchStatus('Matched');
                toast.success('You have accepted the match request!');
    
                // Điều hướng đến cuộc trò chuyện
                //navigate(`/messages/${activity.id}`);
                navigate(`/messages`);
            } else {
                throw new Error('Failed to fetch conversation.');
            }
        } catch (error) {
            console.error('Error accepting match request:', error);
            toast.error('Failed to accept the match request.');
        }
    };
    
    
    // Xử lý từ chối yêu cầu kết nối
    const handleReject = async () => {
        try {
            const response = await respondToMatchRequest(matchDetails.match._id, 'Rejected');
            if (response?.data?.match) {
                setMatchStatus('Rejected');
                toast.success('You have rejected the match request.');
            }
        } catch (error) {
            console.error('Error rejecting match request:', error);
            toast.error('Failed to reject the match request.');
        }
    };

    const handleConnectClick = async () => {
        try {
            if (matchStatus === "Matched") {
                // Nếu đã match, mở giao diện chat
                const conversationResponse = await createOrGetConversationApi(userId);
                if (conversationResponse?.data?.conversation) {
                    navigate(`/messages/${userId}`);
                } else {
                    throw new Error("Failed to create or fetch conversation.");
                }
            } else if (!matchStatus) {
                // Gửi yêu cầu kết nối nếu chưa gửi
                const matchResponse = await createOrGetMatchApi(userId);
                if (matchResponse?.data?.match) {
                    setMatchStatus("Pending"); // Cập nhật trạng thái
                    toast.success("Match request sent!");
                } else {
                    throw new Error("Failed to send match request.");
                }
            }
        } catch (error) {
            console.error("Error in handleConnectClick:", error);
            toast.error(error.message || "Error while connecting. Please try again.");
        }
    };

    
    const openLightbox = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-neutral-100">
                <div className="animate-pulse text-xl text-neutral-600">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-neutral-100 flex justify-center items-center">
                <div className="text-red-600 text-xl font-light">Error loading profile</div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="fixed inset-0 bg-neutral-100 flex justify-center items-center">
                <div className="text-neutral-600 text-xl font-light">Profile not found</div>
            </div>
        );
    }

    const {
        firstName = '',
        lastName = '',
        dateOfBirth = '',
        gender = 'Not specified',
        bio = 'Not provided',
        goals = 'Not specified',
        relationshipStatus = 'Not specified',
        preferenceAgeRange = { min: 18, max: 50 },
        interestedIn = 'Not specified',
        children = 'Not specified',
        childrenDesire = 'Not specified',
        occupation = 'Not provided',
        professionalStatus = 'Not specified',
        workLocation = 'Not specified',
        religion = 'Not specified',
        education = 'Not specified',
        educationAt = [],
        height = { $numberDecimal: null },
        hobbies = [],
        smoking = 'Not specified',
        drinking = 'Not specified',
        nationality = 'Not specified',
        location = { city: 'Not specified', country: 'Not specified' },
        photos = [],
    } = userProfile || {};

    return (
        <div className="min-h-screen bg-neutral-50 flex justify-center items-center p-6">
            <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-neutral-200">
                <div className="relative h-80 bg-gradient-to-br from-neutral-800 to-neutral-600">
                <button 
                        onClick={() => navigate(-1)} 
                        className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-300 flex items-center justify-center"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                        <span className="ml-2 hidden sm:inline">Back</span>
                    </button>
                    {currentUserId && currentUserId !== userId && (
            <button
                onClick={handleConnectClick}
                className={`absolute top-4 right-4 z-10 rounded-full px-4 py-2 transition-all duration-300 flex items-center ${
                    matchStatus === "Matched"
                        ? "bg-green-600 text-white hover:bg-green-500"
                        : matchStatus === "Pending"
                        ? "bg-yellow-500 text-white cursor-not-allowed"
                        : matchStatus === "RespondToRequest"
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "bg-white text-neutral-800 hover:bg-neutral-100"
                }`}
                disabled={matchStatus === "Pending"}
            >
                {matchStatus === "Matched" && (
                    <>
                        <Heart className="mr-2" size={18} />
                        Matched
                    </>
                )}
                {matchStatus === "Pending" && (
                    <>
                        <Heart className="mr-2" size={18} />
                        Pending
                    </>
                )}
                {matchStatus === "RespondToRequest" && (
                <div className="flex space-x-4">
                    <button
                        onClick={handleAccept}
                        className="bg-green-600 text-white rounded-full px-4 py-2 hover:bg-green-500 transition-all"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleReject}
                        className="bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-500 transition-all"
                    >
                        Reject
                    </button>
                </div>
            )}

                {!matchStatus && (
                    <>
                        <Heart className="mr-2" size={18} />
                        Connect
                    </>
                )}
            </button>
        )}

                    {photos && photos.length > 0 && (
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30"
                            style={{ backgroundImage: `url(${photos[0].url})` }}
                        />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end">
                        <img
                            src={avatar}
                            alt="Profile"
                            className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover mr-6"
                        />
                        <div className="text-white">
                            <h1 className="text-4xl font-thin tracking-wide">{`${firstName} ${lastName}`}</h1>
                            <p className="text-xl font-light text-neutral-300 mt-2">{occupation}</p>
                            <div className="flex items-center text-neutral-300 mt-2">
                                <MapPin size={18} className="mr-2" />
                                <span>{`${location.city}, ${location.country}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Profile Content */}
                <div className="grid md:grid-cols-3 gap-8 p-8">
                    {/* Left Column: Personal Details */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Personal Statement */}
                        <section>
                            <h2 className="text-2xl font-light text-neutral-800 border-b pb-3 mb-6">Personal Statement</h2>
                            <p className="text-neutral-600 leading-relaxed italic">"{bio}"</p>
                        </section>

                        {/* Goals */}
                        <section>
                            <h2 className="text-2xl font-light text-neutral-800 border-b pb-3 mb-6">Goals</h2>
                            <p className="text-neutral-600">{goals || 'Not specified'}</p>
                        </section>

                        {/* Personal Details */}
                        <section>
                            <h2 className="text-2xl font-light text-neutral-800 border-b pb-3 mb-6">Personal Details</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <DetailItem icon={<Heart />} label="Gender" value={gender} />
                                <DetailItem icon={<Diamond />} label="Relationship Status" value={relationshipStatus} />
                                <DetailItem icon={<Ruler />} label="Height" value={height && height.$numberDecimal ? `${parseFloat(height.$numberDecimal)} m` : 'Not specified'} />
                                <DetailItem icon={<Users />} label="Interested In" value={interestedIn} />
                                <DetailItem icon={<GraduationCap />} label="Preferred Age Range" value={`${preferenceAgeRange.min}-${preferenceAgeRange.max} years`} />
                            </div>
                        </section>

                        {/* Lifestyle */}
                        <section>
                            <h2 className="text-2xl font-light text-neutral-800 border-b pb-3 mb-6">Lifestyle</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <DetailItem icon={<Cigarette />} label="Smoking" value={smoking} />
                                <DetailItem icon={<Wine />} label="Drinking" value={drinking} />
                                <DetailItem icon={<Baby />} label="Children" value={children} />
                                <DetailItem icon={<HomeIcon />} label="Children Desire" value={childrenDesire} />
                            </div>
                        </section>

                        {/* Hobbies */}
                        <section>
                            <h2 className="text-2xl font-light text-neutral-800 border-b pb-3 mb-6">Hobbies</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {hobbies.length > 0 ? (
                                    hobbies.map((hobby, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 rounded-lg shadow hover:shadow-lg transition hover:scale-105 cursor-pointer"
                                        >
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
                                                <Users className="text-pink-600" size={24} />
                                            </div>
                                            <p className="text-sm text-pink-800 font-semibold text-center">{hobby}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-neutral-600 italic">Not specified</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Quick Details & Gallery */}
                    <div>
                        {/* Work & Education */}
                        <div className="bg-neutral-100 rounded-2xl p-6 space-y-4 mb-8">
                            <DetailItem icon={<Briefcase />} label="Professional Status" value={professionalStatus} />
                            <DetailItem icon={<GraduationCap />} label="Education" value={education} />
                            <DetailItem icon={<MapPin />} label="Education At" value={educationAt.join(', ')} />
                            <DetailItem icon={<HomeIcon />} label="Work Location" value={workLocation} />
                        </div>

                        {/* Additional Details */}
                        <div className="bg-neutral-100 rounded-2xl p-6 space-y-4 mb-8">
                            <DetailItem icon={<Heart />} label="Age" value={`${new Date().getFullYear() - new Date(dateOfBirth).getFullYear()} years`} />
                            <DetailItem icon={<MapPin />} label="Nationality" value={nationality} />
                            <DetailItem icon={<Diamond />} label="Religion" value={religion} />
                        </div>

                        {/* Photo Gallery */}
                        <div>
                            <h3 className="text-2xl font-light text-neutral-800 mb-6 flex items-center">
                                <Camera className="mr-2 text-neutral-600" size={24} />
                                Gallery
                            </h3>
                            
                            {photos.length === 0 ? (
                                <div className="bg-neutral-100 rounded-2xl p-6 text-center">
                                    <p className="text-neutral-500 italic">No photos uploaded yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-4">
                                    {photos.map((photo, index) => (
                                        <div 
                                            key={index} 
                                            className="relative group overflow-hidden rounded-xl"
                                        >
                                            <img
                                                src={photo.url}
                                                alt={`Profile photo ${index + 1}`}
                                                className="w-full h-40 object-cover cursor-pointer"
                                                onClick={() => openLightbox(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Lightbox for full-screen gallery */}
                            <Lightbox
                                open={isOpen}
                                close={() => setIsOpen(false)}
                                slides={photos.map((photo) => ({ 
                                    src: photo.url,
                                    width: photo.width,
                                    height: photo.height
                                }))}
                                index={currentIndex}
                                animation={{ fade: 300 }}
                                carousel={{ finite: photos.length <= 1 }}
                                on={{
                                    click: () => setIsOpen(true),
                                }}
                                styles={{
                                    container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
                                    buttonNext: { display: photos.length <= 1 ? 'none' : 'block' },
                                    buttonPrev: { display: photos.length <= 1 ? 'none' : 'block' }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// Detail Item Component
const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
            {icon}
        </div>
        <div>
            <p className="text-xs text-neutral-500 uppercase">{label}</p>
            <p className="text-neutral-800 font-medium">{value || 'Not specified'}</p>
        </div>
    </div>
);
export default UserProfile;
