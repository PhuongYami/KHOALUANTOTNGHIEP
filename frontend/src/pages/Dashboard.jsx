import React, { useEffect, useState, useCallback } from 'react';
import { 
    Activity, Heart, Users, MessageSquare, 
    Zap, TrendingUp, Target, Award, 
    User, Mail, MapPin, ChevronRight, ChevronLeft, Loader2
} from 'lucide-react';
import { fetchRecommendations } from '../api/searchApi';
import { getInteractions } from '../api/interactionApi';
import { getUserMatches,createOrGetMatchApi,updateMatchStatus } from '../api/matchingApi.js';
import { getUserNotifications } from '../api/notificationApi';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser, fetchProfileCompleteness } from '../features/user/userSlice';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { createInteraction,getProfileViews  } from '../api/interactionApi';
import {getUnreadMessagesCount,createOrGetConversationApi} from '../api/messageApi.js'



// Helper function to get icon for different activity types
const getActivityIcon = (type) => {
    const iconMap = {
        'Match': <Heart />,
        'Like': <Heart />,
        'SuperLike': <Award />,
        'View': <TrendingUp />,
        'Message': <MessageSquare />,
        'MATCH': <Heart />,
        'LIKE': <Heart />,
        'VIEW': <TrendingUp />
    };
    return iconMap[type] || <User />;
};

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    
    if (diffInMinutes < 60) return `${Math.round(diffInMinutes)}m ago`;
    if (diffInHours < 24) return `${Math.round(diffInHours)}h ago`;
    if (diffInDays < 7) return `${Math.round(diffInDays)}d ago`;
    return date.toLocaleDateString();
};
// Helper functions remain the same as previous implementation
const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

const formatLocation = (location) => {
    if (!location || !location.city || !location.country) return 'Unknown';
    return `${location.city}, ${location.country}`;
};

const MatchCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-neutral-200"></div>
        <div className="p-4">
            <div className="h-6 bg-neutral-200 w-3/4 mb-2"></div>
            <div className="h-4 bg-neutral-200 w-1/2 mb-2"></div>
            <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3].map((_, index) => (
                    <span 
                        key={index} 
                        className="bg-neutral-200 text-xs px-2 py-1 rounded-full w-16 h-4"
                    ></span>
                ))}
            </div>
            <div className="mt-4 flex items-center space-x-2">
                <div className="flex-1 h-10 bg-neutral-200 rounded-full"></div>
                <div className="flex-1 h-10 bg-neutral-200 rounded-full"></div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState({
        profileViews: 1247,
        matches: 42,
        newMessages: 8,
        profileCompleteness: 85,
    });
    const [recommendedMatches, setRecommendedMatches] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activitiesLoading, setActivitiesLoading] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMatches, setTotalMatches] = useState(0);
    const [activitiesPage, setActivitiesPage] = useState(1);
    const [totalActivities, setTotalActivities] = useState(0);
    const [profileViews, setProfileViews] = useState(0);
    const [matchCount, setMatchCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

     // Get user ID from Redux store
     const { userId, user,profileCompleteness } = useSelector(state => state.user);
     const maxActivitiesPerPage = 4;
     
     useEffect(() => {
        // Gọi action để lấy độ hoàn thiện hồ sơ
        if (userId) {
            dispatch(fetchProfileCompleteness(userId));
        }
    }, [userId, dispatch]);
    // Debounced recommendation loader
    const loadRecommendations = useCallback(
        debounce(async (userId, page) => {
            if (!userId) return;
    
            setPaginationLoading(true);
            try {
                const response = await fetchRecommendations(userId, 3, page);
                
                if (response.results && response.results.length > 0) {
                    const apiMatches = response.results.map(match => {
                        const user = match.user || {};
                        const photos = user.photos || [];
                        return {
                            name: `${user.firstName || 'Unknown'} ${user.lastName || ''}`.trim(),
                            age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : 'N/A',
                            location: user.location ? formatLocation(user.location) : 'Unknown',
                            avatar: photos.length > 0 ? photos[0].url : 'https://picsum.photos/400',
                            compatibility: Math.round(match.compatibilityScore || 0),
                            interests: user.interests || [],
                            id: user._id || null,
                            userId: user.userId
                        };
                    });
                    setRecommendedMatches(prev => apiMatches);
                    setTotalMatches(response.totalMatches || 0);
                }
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError(err.message || 'Failed to load recommendations');
            } finally {
                setPaginationLoading(false);
                setLoading(false);
            }
        }, 300),
        [calculateAge, formatLocation]  // Thêm dependencies cần thiết
    );
    // Fetch current user and then recommendations
    useEffect(() => {
        if (!userId) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, userId]);
    
 
     // Fetch activities with pagination
     const fetchRecentActivities = useCallback(async (userId, page = 1) => {
        if (!userId) return;
    
        setActivitiesLoading(true);
        try {
            const [
                interactionsData, 
                matchesData, 
                notificationsResponse
            ] = await Promise.all([
                getInteractions(userId),
                getUserMatches(userId),
                getUserNotifications(userId)
            ]);
    
            // Helper function to get priority for activity types
            const getPriorityForActivity = (type) => {
                const priorityMap = {
                    'Match': 3,        // Highest priority
                    'SuperLike': 2,    // High priority
                    'Like': 1,         // Medium priority
                    'View': 0,         // Low priority
                    'default': -1      // Default for other types
                };
                return priorityMap[type] !== undefined ? priorityMap[type] : priorityMap['default'];
            };
    
            // Transform interactions
            const transformedInteractions = interactionsData
            .filter(interaction => interaction.type !== 'Dislike')
            .map(interaction => ({
                id: interaction._id,
                type: interaction.type,
                icon: getActivityIcon(interaction.type),
                message: `${interaction.type} from ${interaction.userTo.username}`,
                timestamp: formatTimestamp(interaction.createdAt),
                priority: getPriorityForActivity(interaction.type),
                originalTimestamp: interaction.createdAt
            }));
    
            // Transform matches
            const transformedMatches = matchesData.map(match => ({
                id: match._id,
                type: 'Match',
                icon: <Heart />,
                message: `Matched with a new connection`,
                timestamp: formatTimestamp(match.matchedAt),
                priority: getPriorityForActivity('Match'),
                originalTimestamp: match.matchedAt
            }));
    
            // Transform notifications
            const filteredNotifications = notificationsResponse.notifications
                .filter(notification => notification.type !== 'MATCH')
                .map(notification => ({
                    id: notification._id,
                    type: notification.type,
                    icon: getActivityIcon(notification.type),
                    message: notification.content,
                    timestamp: formatTimestamp(notification.createdAt),
                    priority: getPriorityForActivity(notification.type),
                    originalTimestamp: notification.createdAt
                }));
    
            // Combine and sort activities
            const combinedActivities = [
                ...transformedInteractions,
                ...transformedMatches,
                ...filteredNotifications
            ].sort((a, b) => {
                // First sort by priority
                if (a.priority !== b.priority) {
                    return b.priority - a.priority;
                }
                // If priorities are equal, sort by most recent timestamp
                return new Date(b.originalTimestamp) - new Date(a.originalTimestamp);
            });
    
            // Pagination
            const startIndex = (page - 1) * maxActivitiesPerPage;
            const paginatedActivities = combinedActivities.slice(startIndex, startIndex + maxActivitiesPerPage);
    
            setRecentActivities(paginatedActivities);
            setTotalActivities(combinedActivities.length);
            setMatchCount(transformedMatches.length);
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError(err.message || 'Failed to load activities');
        } finally {
            setActivitiesLoading(false);
        }
    }, []);

  // Load recommendations and activities when user is available
    useEffect(() => {
        if (userId) {
            loadRecommendations(userId, currentPage);
            fetchRecentActivities(userId, activitiesPage);
        }
    }, [userId, currentPage, activitiesPage]);
    // Handlers for activities pagination
    const handleNextActivitiesPage = () => {
        if (activitiesPage * maxActivitiesPerPage < totalActivities) {
            setActivitiesPage(prev => prev + 1);
        }
    };

    const handlePrevActivitiesPage = () => {
        if (activitiesPage > 1) {
            setActivitiesPage(prev => prev - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage * 3 < totalMatches) {
            setCurrentPage(prev => prev + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };
    useEffect(() => {
        const fetchProfileViews = async () => {
            if (userId) {
                try {
                    const views = await getProfileViews(userId);
                    console.log(userId);
                    console.log(views);
                    setProfileViews(views);
                } catch (error) {
                    console.error('Error fetching profile views:', error);
                }
            }
        };

        fetchProfileViews();
    }, [userId]);
    useEffect(() => {
        const fetchUnreadMessages = async () => {
            if (userId) {
                try {
                    const count = await getUnreadMessagesCount(userId);
                    setUnreadMessagesCount(count);
                } catch (error) {
                    console.error('Error fetching unread messages count:', error);
                }
            }
        };

        fetchUnreadMessages();
    }, [userId]);
    return (
        <div className="min-h-screen bg-neutral-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-thin text-neutral-800 mb-8">Dashboard</h1>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        icon={<Users />} 
                        title="Profile Views" 
                        value={profileViews} 
                        color="from-blue-100 to-blue-200" 
                    />
                    <StatCard 
                        icon={<Heart />} 
                        title="Matches" 
                        value={matchCount} 
                        color="from-pink-100 to-pink-200" 
                    />
                    <StatCard 
                        icon={<MessageSquare />} 
                        title="New Messages" 
                        value={unreadMessagesCount} 
                        color="from-green-100 to-green-200" 
                    />
                    <StatCard 
                        icon={<Activity />} 
                        title="Profile Completeness" 
                        value={`${profileCompleteness}%`} 
                        color="from-purple-100 to-purple-200" 
                    />
                </div>

                 {/* Recent Activity */}
            <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center border-b pb-3 mb-6">
                    <h2 className="text-2xl font-light text-neutral-800 flex items-center">
                        <Zap className="mr-3 text-neutral-600" />
                        Recent Activity
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={handlePrevActivitiesPage} 
                            disabled={activitiesPage === 1 || activitiesLoading}
                            className="p-2 bg-neutral-100 rounded-full disabled:opacity-50"
                        >
                            <ChevronLeft />
                        </button>
                        <span className="text-neutral-600">
                            Page {activitiesPage} of {Math.ceil(totalActivities / maxActivitiesPerPage)}
                        </span>
                        <button 
                            onClick={handleNextActivitiesPage} 
                            disabled={activitiesPage * maxActivitiesPerPage >= totalActivities || activitiesLoading}
                            className="p-2 bg-neutral-100 rounded-full disabled:opacity-50"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {activitiesLoading ? (
                        <div className="flex items-center justify-center text-neutral-600">
                            <Loader2 className="animate-spin mr-2" /> Loading activities...
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600">{error}</div>
                    ) : recentActivities.length === 0 ? (
                        <div className="text-center text-neutral-600">
                            No recent activities found.
                        </div>
                    ) : (
                        recentActivities.map((activity, index) => (
                            <ActivityItem 
                                key={activity.id || index} 
                                icon={activity.icon} 
                                message={activity.message} 
                                timestamp={activity.timestamp} 
                            />
                        ))
                    )}
                </div>
            </section>

                {/* Recommended Matches */}
                <section className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center border-b pb-3 mb-6">
                        <h2 className="text-2xl font-light text-neutral-800 flex items-center">
                            <Target className="mr-3 text-neutral-600" />
                            Recommended Matches
                        </h2>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={handlePrevPage} 
                                disabled={currentPage === 1 || paginationLoading}
                                className="p-2 bg-neutral-100 rounded-full disabled:opacity-50"
                            >
                                <ChevronLeft />
                            </button>
                            <span className="text-neutral-600">
                                Page {currentPage} of {Math.ceil(totalMatches / 3)}
                            </span>
                            <button 
                                onClick={handleNextPage} 
                                disabled={currentPage * 3 >= totalMatches || paginationLoading}
                                className="p-2 bg-neutral-100 rounded-full disabled:opacity-50"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((_, index) => (
                                <MatchCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600">{error}</div>
                    ) : recommendedMatches.length === 0 ? (
                        <div className="text-center text-neutral-600">
                            No recommended matches found. Try updating your profile or preferences.
                        </div>
                    ) : (
                        <div className="relative">
                            {paginationLoading && (
                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                                    <Loader2 className="animate-spin text-neutral-600" size={48} />
                                </div>
                            )}
                            <div className={`grid md:grid-cols-3 gap-6 ${paginationLoading ? 'opacity-50' : ''}`}>
                                {recommendedMatches.map((match, index) => (
                                    <MatchCard key={match.id || index} match={match} />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-md hover:shadow-lg transition`}>
      <div className="flex justify-between items-center">
          <div className="bg-white rounded-full p-3 shadow-md">{icon}</div>
          <div className="text-right">
              <p className="text-sm text-neutral-600 uppercase">{title}</p>
              <p className="text-3xl font-light text-neutral-800">{value}</p>
          </div>
      </div>
  </div>
);

const ActivityItem = ({ icon, message, timestamp }) => (
  <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition">
      <div className="bg-white rounded-full p-2 shadow-md">{icon}</div>
      <div>
          <p className="text-neutral-700">{message}</p>
          <p className="text-xs text-neutral-500">{timestamp}</p>
      </div>
  </div>
);

const MatchCard = ({ match }) => {
    const navigate = useNavigate();
    const { userId } = useSelector(state => state.user);

    const handlePhotoClick = async () => {
        console.log(match);
        try {
            // Create a view interaction
            const interactionData = {
                userFrom: userId,
                userTo: match.userId,
                type: 'View'
            };
            await createInteraction(interactionData);

            // Navigate to the user's profile
            navigate(`/user-profile/${match.userId}`);
        } catch (error) {
            console.error('Error creating view interaction:', error);
            // Navigate to profile even if interaction creation fails
            navigate(`/user-profile/${match.userId}`);
        }
    };
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-2">
            <img 
                src={match.avatar} 
                alt={match.name} 
                onClick={handlePhotoClick}
                className="w-full h-48 object-cover cursor-pointer" 
            />
            <div className="p-4">
                <h3 className="text-xl font-light text-neutral-800">{match.name}</h3>
                <p className="text-sm text-neutral-600">{match.age} • {match.location}</p>
                
                {match.interests && match.interests.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {match.interests.slice(0, 3).map((interest, index) => (
                            <span 
                                key={index} 
                                className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                )}
                
                <div className="mt-4 flex items-center space-x-2">
                    <div className="flex-1 text-neutral-600 text-sm flex items-center">
                        <Award className="mr-2 text-yellow-500" />
                        Compatibility: {match.compatibility}%
                    </div>
                    <button 
                        onClick={handlePhotoClick}
                        className="flex-1 bg-neutral-800 text-white py-2 rounded-full hover:bg-neutral-700 transition"
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
