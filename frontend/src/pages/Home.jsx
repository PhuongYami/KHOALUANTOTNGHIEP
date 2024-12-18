import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, 
    Target, 
    Shield, 
    Globe, 
    Heart, 
    Send 
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-neutral-800 to-neutral-900 text-white">
                <div className="absolute inset-0 opacity-10">
                    <img 
                        src="/api/placeholder/1920/1080" 
                        alt="Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-8 py-24 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-thin text-white mb-6">
                            Elevate Your Connection
                        </h1>
                        <p className="text-xl text-neutral-300 mb-8">
                            Discover meaningful connections with successful, intelligent, and captivating individuals who share your vision and passion.
                        </p>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => navigate("/register")}
                                className="bg-white text-neutral-900 px-6 py-3 rounded-full hover:bg-neutral-100 transition flex items-center"
                            >
                                <Heart className="mr-2" /> Get Started
                            </button>
                            <button 
                                onClick={() => navigate("/about")}
                                className="border border-white text-white px-6 py-3 rounded-full hover:bg-white/10 transition flex items-center"
                            >
                                <Target className="mr-2" /> Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-thin text-neutral-800 mb-4">
                            Why Elite?
                        </h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto">
                            A premium social platform designed for discerning individuals seeking meaningful connections.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Shield className="text-blue-600" />}
                            title="Verified Profiles"
                            description="Rigorous verification process ensuring authenticity and quality of connections."
                        />
                        <FeatureCard 
                            icon={<Globe className="text-green-600" />}
                            title="Global Networking"
                            description="Connect with successful professionals from diverse backgrounds worldwide."
                        />
                        <FeatureCard 
                            icon={<Users className="text-purple-600" />}
                            title="Intelligent Matching"
                            description="Advanced algorithms crafting meaningful connections based on compatibility."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-neutral-100 py-16">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <h2 className="text-4xl font-thin text-neutral-800 mb-6">
                        Your Journey Starts Here
                    </h2>
                    <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
                        Join a curated community of ambitious, successful individuals ready to explore genuine connections.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={() => navigate("/register")}
                            className="bg-neutral-800 text-white px-8 py-4 rounded-full hover:bg-neutral-700 transition flex items-center"
                        >
                            <Send className="mr-2" /> Create Your Profile
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition transform hover:-translate-y-2">
        <div className="bg-neutral-100 rounded-full p-4 inline-block mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-3">
            {title}
        </h3>
        <p className="text-neutral-600">
            {description}
        </p>
    </div>
);

export default Home;