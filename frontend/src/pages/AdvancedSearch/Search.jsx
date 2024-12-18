import React, { useState, useEffect } from "react";
import { Search, Filter, X, Users, MapPin, Heart, Ruler, Award } from "lucide-react";
import { fetchAdvancedSearch } from '../../api/searchApi';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { createInteraction } from "../../api/interactionApi";
import {createOrGetConversationApi} from '../../api/messageApi.js'
import {createOrGetMatchApi} from '../../api/matchingApi.js';


const AdvancedSearch = () => {
    const [filters, setFilters] = useState({
        ageRange: { min: 18, max: 50 },
        gender: "",
        goals: "",
        relationshipStatus: "",
        children: "",
        childrenDesire: "",
        smoking: "",
        drinking: "",
        radius: 50,
    });

    const [results, setResults] = useState([]);
    const [isFiltersCollapsed, setFiltersCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get user ID from Redux store
    const userId = useSelector(state => state.user.userId);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ 
            ...prev, 
            [key]: value 
        }));
    };

    const handleAgeRangeChange = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            ageRange: {
                ...prev.ageRange,
                [type]: parseInt(value)
            }
        }));
    };

    const handleSearch = async () => {
        if (!userId) {
            toast.error("User not logged in");
            return;
        }   

        setLoading(true);
        try {
            const processedFilters = {
                ageRange: filters.ageRange,
                gender: filters.gender || undefined,
                goals: filters.goals || undefined,
                relationshipStatus: filters.relationshipStatus || undefined,
                children: filters.children || undefined,
                childrenDesire: filters.childrenDesire || undefined,
                smoking: filters.smoking || undefined,
                drinking: filters.drinking || undefined,
                radius: filters.radius || undefined,
            };

            const searchResults = await fetchAdvancedSearch(userId, processedFilters);
            
            const resultsData = searchResults.data || searchResults;
            
            setResults(resultsData);
            setFiltersCollapsed(true);

            if (resultsData.length === 0) {
                toast.info("No results found. Try increasing the search radius or relaxing filters.");
            }
            
        } catch (error) {
            console.error("Search error:", error);
            toast.error(error.response?.data?.message || "Failed to perform search");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFilters({
            ageRange: { min: 18, max: 50 },
            gender: "",
            goals: "",
            relationshipStatus: "",
            children: "",
            childrenDesire: "",
            smoking: "",
            drinking: "",
            radius:50,
        });
        setResults([]);
        setFiltersCollapsed(false);
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-thin text-neutral-800 mb-8">Advanced Search</h1>

                {/* Filters Section */}
                <div className={`bg-white p-6 rounded-2xl shadow-lg mb-8 transition-all ${isFiltersCollapsed ? "h-16 overflow-hidden" : "h-auto"}`}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-light text-neutral-800 flex items-center">
                            <Filter className="mr-3 text-neutral-600" />
                            Filters
                        </h2>
                        {isFiltersCollapsed && (
                            <button
                                onClick={() => setFiltersCollapsed(false)}
                                className="text-neutral-600 hover:text-neutral-800"
                            >
                                Expand
                            </button>
                        )}
                    </div>

                    {!isFiltersCollapsed && (
                        <div>
                            <div className="grid md:grid-cols-3 gap-6 mt-6">
                                {/* Age Range */}
                                <div>
                                    <label className="text-sm text-neutral-600 block mb-2">Age Range</label>
                                    <div className="flex space-x-2">
                                        <select
                                            value={filters.ageRange.min}
                                            onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                                        >
                                            {[...Array(82)].map((_, i) => (
                                                <option key={i} value={18 + i}>{18 + i}</option>
                                            ))}
                                        </select>
                                        <span className="self-center">-</span>
                                        <select
                                            value={filters.ageRange.max}
                                            onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                                        >
                                            {[...Array(82)].map((_, i) => (
                                                <option key={i} value={18 + i}>{18 + i}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Gender */}
                                <FilterSelect
                                    label="Gender"
                                    options={["Male", "Female", "Other"]}
                                    value={filters.gender}
                                    onChange={(value) => handleFilterChange("gender", value)}
                                />

                                {/* Goals */}
                                <FilterSelect
                                    label="Goals"
                                    options={[
                                        "Conversation and friendship", 
                                        "Long-term relationships", 
                                        "Creating a family", 
                                        "Casual dating", 
                                        "Serious relationship", 
                                        "Other"
                                    ]}
                                    value={filters.goals}
                                    onChange={(value) => handleFilterChange("goals", value)}
                                />

                                {/* Relationship Status */}
                                <FilterSelect
                                    label="Relationship Status"
                                    options={["Single", "Divorced", "Single parent", "Separated", "In a relationship", "Complicated"]}
                                    value={filters.relationshipStatus}
                                    onChange={(value) => handleFilterChange("relationshipStatus", value)}
                                />

                                {/* Children */}
                                <FilterSelect
                                    label="Children"
                                    options={["Don't have children", "Have children"]}
                                    value={filters.children}
                                    onChange={(value) => handleFilterChange("children", value)}
                                />

                                {/* Children Desire */}
                                <FilterSelect
                                    label="Children Desire"
                                    options={[
                                        "I don't want children right now, maybe later", 
                                        "No, I don't want children", 
                                        "I would like to have children"
                                    ]}
                                    value={filters.childrenDesire}
                                    onChange={(value) => handleFilterChange("childrenDesire", value)}
                                />
                                {/*Radius*/}
                                <div>
                                    <label className="text-sm text-neutral-600 block mb-2">Search Radius (km)</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="200"
                                        step="10"
                                        value={filters.radius}
                                        onChange={(e) => handleFilterChange("radius", parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                    <span className="block text-neutral-600 text-sm mt-1">
                                        {filters.radius} km
                                    </span>
                                </div>
                                {/* Smoking */}
                                <FilterSelect
                                    label="Smoking"
                                    options={["Do not smoke", "Regularly", "Occasionally"]}
                                    value={filters.smoking}
                                    onChange={(value) => handleFilterChange("smoking", value)}
                                />

                                {/* Drinking */}
                                <FilterSelect
                                    label="Drinking"
                                    options={["Do not drink", "Frequently", "Socially"]}
                                    value={filters.drinking}
                                    onChange={(value) => handleFilterChange("drinking", value)}
                                />
                            </div>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    onClick={handleReset}
                                    className="text-neutral-600 hover:text-neutral-800"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className={`bg-neutral-800 text-white px-6 py-2 rounded-full hover:bg-neutral-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {results.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-light text-neutral-800 mb-6 flex items-center">
                            <Award className="mr-3 text-neutral-600" />
                            Search Results
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {results.map((result) => (
                                <ProfileCard 
                                    key={result.user._id} 
                                    profile={result.user} 
                                    compatibilityScore={result.compatibilityScore}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterSelect = ({ label, options, value, onChange }) => (
    <div>
        <label className="text-sm text-neutral-600 block mb-2">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
            <option value="">Select {label}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

const ProfileCard = ({ profile, compatibilityScore }) => {
    const navigate = useNavigate();
    const userId = useSelector(state => state.user.userId);

    const handleProfileView = async () => {
        try {
            // Create a view interaction
            const interactionData = {
                userFrom: userId,
                userTo: profile.userId,
                type: 'View'
            };
            await createInteraction(interactionData);

            // Navigate to the user's profile
            navigate(`/user-profile/${profile.userId}`);
        } catch (error) {
            console.error('Error creating view interaction:', error);
            // Navigate even if interaction creation fails
            navigate(`/user-profile/${profile.userId}`);
        }
    };
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-2">
            <img
            onClick={handleProfileView}
                src={profile.photos?.[0]?.url || "/api/placeholder/400/400"}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-light text-neutral-800">
                    {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-sm text-neutral-600">
                    {profile.age} • {profile.location.city}, {profile.location.country}
                </p>
                <div className="mt-2 text-sm text-neutral-600">
                    Compatibility Score: {(compatibilityScore).toFixed(2)}%
                </div>
                <div className="mt-4 flex space-x-2">
                    <button 
                        onClick={handleProfileView}
                        className="flex-1 bg-neutral-800 text-white py-2 rounded-full hover:bg-neutral-700 transition"
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedSearch;