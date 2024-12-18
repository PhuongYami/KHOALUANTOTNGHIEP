import React, { useState, useEffect } from 'react';
import { 
    Calendar, MapPin, Users, Heart, Star, 
    Filter, TrendingUp, Award, Clock , ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 

// Import new API services
import { getInteractions } from '../api/interactionApi';
import { getUserMatches } from '../api/matchingApi.js';
import { getUserNotifications } from '../api/notificationApi';
import { fetchCurrentUser} from '../features/user/userSlice.js';
const mockActivities = [
    {
        id: 1,
        type: 'Match',
        icon: <Heart />,
        title: 'You matched with Emma Johnson',
        details: 'New match! Start a conversation',
        timestamp: '2h ago'
    },
    {
        id: 2,
        type: 'Profile View',
        icon: <TrendingUp />,
        title: 'Profile View Increase',
        details: '+24 profile views this week',
        timestamp: 'Yesterday'
    },
    {
        id: 3,
        type: 'Super Like',
        icon: <Star />,
        title: 'Super Like from Liam Chen',
        details: 'Someone is really interested!',
        timestamp: '3d ago'
    }
];

const mockUpcomingEvents = [
    {
        id: 1,
        title: 'Coffee Date',
        date: 'Jun 15, 2024',
        time: '2:00 PM',
        location: 'Starbucks, Downtown',
        participants: 4
    },
    {
        id: 2,
        title: 'Group Hiking',
        date: 'Jul 20, 2024',
        time: '9:00 AM',
        location: 'Mountain Trail Park',
        participants: 12
    }
];

const Activities = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [activities, setActivities] = useState([]);
    const [matches, setMatches] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const { userId, user } = useSelector(state => state.user);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useState(5); // Số mục mỗi trang
    const [totalItems, setTotalItems] = useState(0);
    const [pageStates, setPageStates] = useState({
        all: 1,
        matches: 1,
        views: 1,
        likes: 1
    });
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Reset page to 1 for the new tab
        setCurrentPage(pageStates[tab] || 1);
    };
    const handlePageChange = (newPage) => {
        setPageStates((prevState) => ({
            ...prevState,
            [activeTab]: newPage
        }));
        setCurrentPage(newPage);
    };
    
    
    const dispatch = useDispatch();
    useEffect(() => {
        if (!userId) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, userId]);
    useEffect(() => {
        if (userId) {
            setActivities([]);
            setFilteredActivities([]);
            fetchActivitiesData();
        }
    }, [userId]);

    const fetchActivitiesData = async () => {
        setLoading(true);
        try {
            const [interactionsData, matchesData, notificationsResponse] = await Promise.all([
                getInteractions(userId),
                getUserMatches(userId),
                getUserNotifications(userId)
            ]);
    
            // Thêm trường priority để ưu tiên hiển thị
            const transformedInteractions = interactionsData
                .filter(interaction => interaction.type !== 'Dislike')
                .map((interaction) => ({
                    id: interaction._id,
                    type: interaction.type,
                    icon: getIconForInteraction(interaction.type),
                    title: `${interaction.type} from ${interaction.userTo.username}`,
                    details: `Someone is interested in you!`,
                    timestamp: formatTimestamp(interaction.createdAt),
                    priority: getPriorityForActivity(interaction.type),
                    originalTimestamp: interaction.createdAt
                }));
    
            const transformedMatches = matchesData.map((match) => {
                const otherUser = match.user1._id === userId ? match.user2 : match.user1;
            
                return {
                    id: match._id,
                    type: 'Match',
                    icon: <Heart />,
                    title: `New Match with ${otherUser.username}`,
                    details: `Compatibility: ${match.compatibilityScore}%`,
                    timestamp: formatTimestamp(match.matchedAt),
                    priority: getPriorityForActivity('Match'),
                    originalTimestamp: match.matchedAt
                };
            });
    
            const transformedNotifications = notificationsResponse.notifications.map((notification) => ({
                id: notification._id,
                type: notification.type,
                icon: getIconForNotificationType(notification.type),
                title: notification.content,
                details: `${notification.type} Notification`,
                timestamp: formatTimestamp(notification.createdAt),
                priority: getPriorityForActivity(notification.type),
                originalTimestamp: notification.createdAt
            }));
    
            // Sắp xếp kết hợp với priority và timestamp
            const combinedActivities = [
                ...transformedInteractions,
                ...transformedMatches,
                ...transformedNotifications
            ].sort((a, b) => {
                // Ưu tiên theo priority trước
                if (a.priority !== b.priority) {
                    return b.priority - a.priority;
                }
                // Nếu priority bằng nhau, sắp xếp theo thời gian mới nhất
                return new Date(b.originalTimestamp) - new Date(a.originalTimestamp);
            });
    
            setActivities(combinedActivities);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setLoading(false);
        }
    };
    
    // Hàm để xác định độ ưu tiên của từng loại hoạt động
    const getPriorityForActivity = (type) => {
        const priorityMap = {
            'Match': 3,        // Độ ưu tiên cao nhất
            'SuperLike': 2,    // Ưu tiên cao
            'Like': 1,         // Ưu tiên trung bình
            'View': 0,         // Ưu tiên thấp
            'default': -1      // Mặc định cho các loại khác
        };
        return priorityMap[type] !== undefined ? priorityMap[type] : priorityMap['default'];
    };
    useEffect(() => {
        const filtered = activities.filter((activity) => {
            switch (activeTab) {
                case 'matches':
                    return activity.type === 'Match';
                case 'views':
                    return activity.type === 'View';
                case 'likes':
                    return ['Like', 'SuperLike'].includes(activity.type);
                default:
                    return true;
            }
        });
    
        const currentTabPage = pageStates[activeTab] || 1;
    
        setTotalItems(filtered.length);
        setFilteredActivities(
            filtered.slice((currentTabPage - 1) * maxItemsPerPage, currentTabPage * maxItemsPerPage)
        );
    }, [activities, activeTab, pageStates, maxItemsPerPage]);
    
    
    // Helper functions for icon, title, details mapping
     // Helper functions for icons
     const getIconForInteraction = (type) => {
        const icons = {
            'Like': <Heart />,
            'SuperLike': <Star />,
            'View': <TrendingUp />
        };
        return icons[type] || <Heart />;
    };

    const getIconForNotificationType = (type) => {
        const icons = {
            'MATCH': <Heart />,
            'LIKE': <Heart />,
            'VIEW': <TrendingUp />
        };
        return icons[type] || <Heart />;
    };

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

    return (
         <div className="min-h-screen bg-neutral-50 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-thin text-neutral-800 mb-4 sm:mb-0">Activities</h1>
                    <button className="bg-white shadow-md rounded-full p-3 hover:bg-neutral-100 transition">
                        <Filter />
                    </button>
                </div>

               {/* Tabs */}
               <div className="flex space-x-2 sm:space-x-4 mb-6 bg-white rounded-full p-2 shadow-md">
               {['all', 'matches', 'views', 'likes'].map((tab) => (
                    <button
                        key={tab}
                        className={`
                            flex-1 py-2 rounded-full capitalize text-xs sm:text-base
                            ${activeTab === tab 
                                ? 'bg-neutral-800 text-white' 
                                : 'text-neutral-600 hover:bg-neutral-100'
                            }
                        `}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab}
                    </button>
                ))}

                </div>

                {/* Activities Section */}
                <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
                <div className="flex justify-between items-center border-b pb-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-light text-neutral-800 flex items-center">
                    <Award className="mr-3 text-neutral-600 w-5 h-5 sm:w-6 sm:h-6" />
                    Recent Activities
                </h2>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => handlePageChange(Math.max((pageStates[activeTab] || 1) - 1, 1))}
                        disabled={(pageStates[activeTab] || 1) === 1}
                        className="p-2 bg-neutral-100 rounded-full disabled:opacity-50"
                    >
                        <ChevronLeft />
                    </button>
                    <span className="text-neutral-600">
                        Page {pageStates[activeTab] || 1} of {Math.ceil(totalItems / maxItemsPerPage)}
                    </span>
                    <button
                        onClick={() =>
                            handlePageChange(
                                Math.min((pageStates[activeTab] || 1) + 1, Math.ceil(totalItems / maxItemsPerPage))
                            )
                        }
                        disabled={(pageStates[activeTab] || 1) * maxItemsPerPage >= totalItems}
                        className="p-2 bg-neutral-100 rounded-full disabled:opacity-50"
                    >
                        <ChevronRight />
                    </button>
                </div>

            </div>

                <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-neutral-600">Loading activities...</div>
                ) : filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))
                ) : (
                    <div className="text-center text-neutral-500">
                        No activities found for this category.
                    </div>
                )}
            </div>

                </section>

                {/* Upcoming Events */}
                {/* <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-light text-neutral-800 border-b pb-3 mb-6 flex items-center">
                        <Calendar className="mr-3 text-neutral-600 w-5 h-5 sm:w-6 sm:h-6" />
                        Upcoming Events
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {mockUpcomingEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </section> */}
            </div>
            {/* <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
                {loading ? (
                    <div>Loading activities...</div>
                ) : (
                    activities.map(activity => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))
                )}
            </section> */}
        </div>
    );
};
const ActivityItem = ({ activity }) => {
    const navigate = useNavigate();

    const handleActivityClick = () => {
        if (activity.type === 'Match') {
            console.log(activity);
            navigate(`/messages/${activity.id}`); // Chuyển sang trang Messages với ID match
        }
    };

    return(
        <div className="flex items-center space-x-2 sm:space-x-4 p-3 sm:p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition"
        onClick={handleActivityClick}>
            <div className="bg-white rounded-full p-2 sm:p-3 shadow-md">{activity.icon}</div>
            <div className="flex-1">
                <h3 className="text-sm sm:text-base text-neutral-800 font-medium">{activity.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-600">{activity.details}</p>
            </div>
            <span className="text-[10px] sm:text-xs text-neutral-500">{activity.timestamp}</span>
        </div>
    );

}
    
    

const EventCard = ({ event }) => (
    <div className="bg-neutral-100 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-light text-neutral-800">{event.title}</h3>
            <div className="flex items-center space-x-2 text-neutral-600">
                <Clock size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{event.time}</span>
            </div>
        </div>
        <div className="flex items-center space-x-2 mb-4">
            <MapPin size={16} className="text-neutral-600 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm text-neutral-700">{event.location}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-auto space-y-4 sm:space-y-0">
            <div className="flex -space-x-4 mb-2 sm:mb-0">
                {[...Array(event.participants)].map((_, i) => (
                    <img 
                        key={i} 
                        src="/api/placeholder/80/80" 
                        alt={`Participant ${i+1}`} 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
                    />
                ))}
            </div>
            <button className="bg-neutral-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-neutral-700 transition text-xs sm:text-base">
                Join Event
            </button>
        </div>
    </div>
);



export default Activities;