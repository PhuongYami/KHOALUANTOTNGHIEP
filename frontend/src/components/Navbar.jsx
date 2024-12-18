import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, fetchCurrentUser } from '../features/auth/authSlice';
import { clearUser } from '../features/user/userSlice';
import UserSection from './UserSection';
import { 
    Compass, MessageSquare, Activity, Search, LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, user, token, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && !user) {
            dispatch(fetchCurrentUser())
                .unwrap()
                .catch((error) => console.error('Failed to fetch user:', error));
        }
    }, [token, user, dispatch]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            await dispatch(clearUser());

            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    // Navigation Link Component
    const NavLink = ({ icon, label, onClick }) => (
        <button 
            className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            onClick={onClick}
        >
            {icon}
            <span className="text-sm">{label}</span>
        </button>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                <div 
                    className="flex items-center space-x-2 text-2xl font-thin text-neutral-800 tracking-wider cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <img 
                        src="/elite-logo.png" // hoặc logo.png
                        alt="ELITEpaire Logo" 
                        className="h-8 w-8" // Điều chỉnh kích thước phù hợp
                    />
                    <span>ELITE</span>
                </div>

                    {/* Navigation Links for Desktop */}
                    {isAuthenticated && (
                        <nav className="hidden md:flex space-x-8">
                            <NavLink 
                                icon={<LayoutDashboard size={20} />} 
                                label="Dashboard" 
                                onClick={() => navigate('/dashboard')} 
                            />
                            <NavLink 
                                icon={<Compass size={20} />} 
                                label="Discover" 
                                onClick={() => navigate('/discover')} 
                            />
                            <NavLink 
                                icon={<MessageSquare size={20} />} 
                                label="Messages" 
                                onClick={() => navigate('/messages')} 
                            />
                            <NavLink 
                                icon={<Activity size={20} />} 
                                label="Activities" 
                                onClick={() => navigate('/activities')} 
                            />
                            <NavLink 
                                icon={<Search size={20} />} 
                                label="Search" 
                                onClick={() => navigate('/search')} 
                            />
                        </nav>
                    )}

                    {/* User Section */}
                    <UserSection 
                        isAuthenticated={isAuthenticated}
                        user={user}
                        onLogout={handleLogout}
                        onLogin={() => navigate('/login')}
                        onRegister={() => navigate('/register')}
                    />
                </div>
            </div>
        </header>
    );
};

export default Navbar;