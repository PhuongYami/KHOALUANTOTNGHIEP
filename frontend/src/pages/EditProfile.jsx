import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile,fetchCurrentUser } from '../features/user/userSlice';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import { 
    Save, ArrowLeft
} from 'lucide-react';

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.user);

    const hobbiesEnum = [
        'Traveling',
        'Cooking',
        'Reading',
        'Sports',
        'Music',
        'Photography',
        'Art and Craft',
        'Dancing',
        'Writing',
        'Gaming',
        'Hiking',
        'Fitness and Gym',
        'Yoga',
        'Swimming',
        'Camping',
        'Socializing',
        'Wine Tasting',
        'Watching Movies',
        'Learning Languages',
        'Golf',
    ];
    
    // State to manage form data
    const [formData, setFormData] = useState({
        // Basic Information
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        bio: '',
        goals: 'Other',
        relationshipStatus: '',
        preferenceAgeRange: { min: 18, max: 50 },
        interestedIn: '',
        children: '',
        childrenDesire: '',
        
        // Work and education
        occupation: '',
        professionalStatus: '',
        workLocation: '',
        religion: '',
        education: '',
        educationAt: [],
        
        // Lifestyle
        height: '',
        hobbies: [],
        smoking: 'Do not smoke',
        drinking: 'Do not drink',
        
        // Location
        nationality: '',
        location: {
            type: 'Point',
            coordinates: [0, 0],
            city: '',
            country: ''
        },
        
        // Photos
        photos: [],
    
        // Additional metadata
        lastActiveAt: new Date()
    });
    

    // State for managing photo uploads
    const [photos, setPhotos] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newHobby, setNewHobby] = useState('');

    // Load existing user data when component mounts
    useEffect(() => {
        if (user && user.profile) {
            setFormData({
                ...user.profile,
                dateOfBirth: user.profile.dateOfBirth
                ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0] 
                : '',
                preferenceAgeRange: user.profile.preferenceAgeRange || { min: 18, max: 50 },
                height: user.profile.height?.$numberDecimal || '',
                location: user.profile.location || { city: '', country: '' },
                 photos: user.profile.photos || [],
            });
            setPhotos(user.profile.photos || []);
        }
    }, [user]);
    useEffect(() => {
        if (!user) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, user]);
    const handlePhotoChange = (updatedPhotos) => {
        // updatedPhotos là danh sách ảnh [{ url, uploadedAt }]
        setFormData((prev) => ({
            ...prev,
            photos: updatedPhotos, // Cập nhật toàn bộ danh sách ảnh vào formData
        }));
    };
    

    // Generic input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for nested objects
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Add new hobby
    const addHobby = () => {
        if (newHobby && hobbiesEnum.includes(newHobby) && !formData.hobbies.includes(newHobby)) {
            setFormData((prev) => ({
                ...prev,
                hobbies: [...prev.hobbies, newHobby],
            }));
            setNewHobby('');
        } else if (!hobbiesEnum.includes(newHobby)) {
            alert('This hobby is not in the allowed list.');
        }
    };
    

    // Remove hobby
    const removeHobby = (hobbyToRemove) => {
        setFormData(prev => ({
            ...prev,
            hobbies: prev.hobbies.filter(hobby => hobby !== hobbyToRemove)
        }));
    };
    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Submitting data:', formData); // Log để kiểm tra dữ liệu gửi đi
    
        try {
            await dispatch(updateUserProfile(formData)); // Dispatch action
            console.log('Profile updated successfully');
            navigate('/profile'); // Chuyển hướng sau khi cập nhật thành công
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };
    
    const [newEducationInstitution, setNewEducationInstitution] = useState(''); // Giá trị cho trường mới

    // Cập nhật trình độ học vấn
    const handleEducationChange = (e) => {
        setFormData((prev) => ({ ...prev, education: e.target.value }));
    };
    
    // Thêm trường học mới
    const addEducationInstitution = () => {
        if (newEducationInstitution.trim() !== '' && !formData.educationAt.includes(newEducationInstitution.trim())) {
            setFormData((prev) => ({
                ...prev,
                educationAt: [...prev.educationAt, newEducationInstitution.trim()],
            }));
            setNewEducationInstitution(''); // Reset input sau khi thêm
        }
    };
    
    // Xóa trường học khỏi danh sách
    const removeEducationInstitution = (institutionToRemove) => {
        setFormData((prev) => ({
            ...prev,
            educationAt: prev.educationAt.filter((institution) => institution !== institutionToRemove),
        }));
    };
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
    
                    try {
                        // Sử dụng API của Nominatim để lấy thông tin city và country
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
    
                        if (data && data.address) {
                            const city = data.address.city || 
                                         data.address.town || 
                                         data.address.village || 
                                         data.address.state;
                            const country = data.address.country;
    
                            // Cập nhật toàn bộ location
                            setFormData((prev) => ({
                                ...prev,
                                location: {
                                    type: 'Point',
                                    coordinates: [longitude, latitude],
                                    city: city || '',
                                    country: country || ''
                                }
                            }));
                        }
                    } catch (error) {
                        console.error('Error fetching location details:', error);
                    }
                },
                (error) => {
                    console.error('Error fetching location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };
    
    
    

    if (loading) return <div className="fixed inset-0 flex justify-center items-center">Loading...</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-neutral-50 flex justify-center items-center p-6">
            <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-neutral-200">
                {/* Header */}
                <div className="bg-gradient-to-br from-neutral-800 to-neutral-600 p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => navigate('/profile')} 
                            className="text-white hover:bg-neutral-700 p-2 rounded-full"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-thin text-white">Edit Profile</h1>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <Save size={18} />
                        <span>Save Profile</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8 p-8">
                    {/* Left Column: Personal Information */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Basic Information */}
                        <section>
                            <h2 className="text-2xl font-medium text-neutral-800 border-b pb-3 mb-6">Basic Information</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormInput 
                                    label="First Name" 
                                    name="firstName" 
                                    value={formData.firstName} 
                                    onChange={handleInputChange} 
                                />
                                <FormInput 
                                    label="Last Name" 
                                    name="lastName" 
                                    value={formData.lastName} 
                                    onChange={handleInputChange} 
                                />
                                <FormInput 
                                    label="Date of Birth" 
                                    name="dateOfBirth" 
                                    type="date" 
                                    value={formData.dateOfBirth} 
                                    onChange={handleInputChange} 
                                />
                                <FormSelect 
                                    label="Gender" 
                                    name="gender" 
                                    value={formData.gender} 
                                    onChange={handleInputChange}
                                    options={['Male', 'Female', 'Other']}
                                />
                                <FormInput 
                                    label="Height (meters)" 
                                    name="height" 
                                    type="number" 
                                    step="0.01" 
                                    value={formData.height} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter your height in meters"
                                />
                                <FormSelect 
                                    label="Religion" 
                                    name="religion" 
                                    value={formData.religion} 
                                    onChange={handleInputChange}
                                    options={['Christianity', 'Islam', 'Hinduism','Buddhism','Judaism','Other']}
                                />       
                            </div>
                        </section>

                        {/* Personal Statement & Goals */}
                        <section>
                            <h2 className="text-2xl font-medium text-neutral-800 border-b pb-3 mb-6">About Me</h2>
                            <div className="space-y-4">
                                <FormTextarea 
                                    label="Personal Bio" 
                                    name="bio" 
                                    value={formData.bio} 
                                    onChange={handleInputChange} 
                                    placeholder="Write a short description about yourself..."
                                />
                                <FormSelect 
                                    label="Relationship Goals" 
                                    name="goals" 
                                    value={formData.goals} 
                                    onChange={handleInputChange}
                                    options={[
                                    'Conversation and friendship', 
                                    'Long-term relationships', 
                                    'Creating a family', 
                                    'Casual dating', 
                                    'Serious relationship',
                                    'Other'
                                    ]}
                                />
                                <div className="grid md:grid-cols-2 gap-4">
                                <FormInput 
                                    label="Occupation Status" 
                                    name="occupation" 
                                    value={formData.occupation} 
                                    onChange={handleInputChange}
                                    placeholder="You career"
                                />
                                <FormSelect 
                                    label="Professional Status" 
                                    name="professionalStatus" 
                                    value={formData.professionalStatus} 
                                    onChange={handleInputChange}
                                    options={[
                                        'Unemployed', 
                                        'Specialist', 
                                        'Entrepreneur', 
                                        'Workman', 
                                        'Junior manager', 
                                        'Freelancer/Self-employed', 
                                        'Student'
                                    ]}
                                />
                                    {/* Work Location */}
                                    <FormInput
                                        label="Work Location"
                                        name="workLocation"
                                        value={formData.workLocation}
                                        onChange={handleInputChange}
                                        placeholder="Enter your work location"
                                    />
                                    {/* Nationality */}
                                    <FormInput
                                        label="Nationality"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleInputChange}
                                        placeholder="Enter your nationality"
                                    />

                                    
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-medium text-neutral-800 border-b pb-3 mb-6">Education</h2>

                            {/* Trình độ học vấn */}
                            <div className="mb-6">
                                <label className="block text-neutral-600 text-sm mb-2">Education Level</label>
                                <select
                                    name="education"
                                    value={formData.education}
                                    onChange={handleEducationChange}
                                    className="w-full border rounded-lg p-2"
                                >
                                    <option value="">Select Level</option>
                                    <option value="Some college">Some college</option>
                                    <option value="Associate, bachelor's, or master's degree">Associate, bachelor's, or master's degree</option>
                                    <option value="Doctoral degree">Doctoral degree</option>
                                    <option value="Vocational high school degree">Vocational high school degree</option>
                                    <option value="More than one academic degree">More than one academic degree</option>
                                    <option value="High school degree">High school degree</option>
                                </select>
                            </div>

                            {/* Danh sách trường học */}
                            <div className="mb-6">
                                <label className="block text-neutral-600 text-sm mb-2">Educational Institutions</label>
                                <div className="flex space-x-2 mb-4">
                                    <input
                                        type="text"
                                        value={newEducationInstitution}
                                        onChange={(e) => setNewEducationInstitution(e.target.value)}
                                        placeholder="Add a new institution"
                                        className="flex-grow border rounded-lg p-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={addEducationInstitution}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.educationAt.map((institution, index) => (
                                        <div
                                            key={`${institution}-${index}`}
                                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center space-x-2"
                                        >
                                            <span>{institution}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeEducationInstitution(institution)}
                                                className="text-green-500 hover:text-green-700 ml-2"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section>
                        <h2 className="text-2xl font-medium text-neutral-800 border-b pb-3 mb-6">Life Styles</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    
                                    <FormSelect 
                                    label="Smoking Habits" 
                                    name="smoking" 
                                    value={formData.smoking} 
                                    onChange={handleInputChange}
                                    options={['Do not smoke', 'Regularly', 'Occasionally']}
                                />
                                <FormSelect 
                                    label="Drinking Habits" 
                                    name="drinking" 
                                    value={formData.drinking} 
                                    onChange={handleInputChange}
                                    options={['Do not drink', 'Frequently', 'Socially']}
                                />
                                <FormSelect 
                                    label="Children" 
                                    name="children" 
                                    value={formData.children} 
                                    onChange={handleInputChange}
                                    options={["Don't have children", "Have children"]}
                                />
                                <FormSelect 
                                    label="Children Desire" 
                                    name="childrenDesire" 
                                    value={formData.childrenDesire} 
                                    onChange={handleInputChange}
                                    options={[
                                        "I don't want children right now, maybe later", 
                                        "No, I don't want children", 
                                        "I would like to have children"
                                    ]}
                                />
                                </div>
                        </section>
                        {/* Hobbies */}
                        <section>
    <h2 className="text-2xl font-medium text-neutral-800 border-b pb-3 mb-6">Hobbies</h2>
    <div className="flex space-x-2 mb-4">
        <select
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            className="flex-grow border rounded-lg p-2"
        >
            <option value="">Select a hobby</option>
            {hobbiesEnum.map((hobby) => (
                <option key={hobby} value={hobby}>
                    {hobby}
                </option>
            ))}
        </select>
        <button
            type="button"
            onClick={addHobby}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
            Add
        </button>
    </div>
    <div className="flex flex-wrap gap-2">
        {formData.hobbies.map((hobby) => (
            <div
                key={hobby}
                className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full flex items-center space-x-2"
            >
                {hobby}
                <button
                    type="button"
                    onClick={() => removeHobby(hobby)}
                    className="text-pink-500 hover:text-pink-700 ml-2"
                >
                    ×
                </button>
            </div>
        ))}
    </div>
</section>

                    </div>

                    {/* Right Column: Additional Details */}
                    <div>
                        {/* Photos */}
                        <ProfilePhotoUpload
                            initialPhotos={formData.photos} // Truyền danh sách ảnh từ formData
                            onPhotoChange={handlePhotoChange} // Truyền hàm để cập nhật formData khi ảnh thay đổi
                        />

                        <section className="mb-8">
                            <h2 className="text-xl font-medium text-neutral-800 border-b pb-2 mb-4">Location Information</h2>
                            <div className="space-y-3">
                                <div className="flex space-x-4">
                                    <FormInput
                                        label="Latitude"
                                        name="location.coordinates[0]"
                                        value={formData.location.coordinates[0] || ''}
                                        readOnly
                                        placeholder="Latitude"
                                        type="number"
                                        className="flex-1"
                                    />
                                    <FormInput
                                        label="Longitude"
                                        name="location.coordinates[1]"
                                        value={formData.location.coordinates[1] || ''}
                                        readOnly
                                        placeholder="Longitude"
                                        type="number"
                                        className="flex-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="City"
                                        name="location.city"
                                        value={formData.location.city || ''}
                                        readOnly
                                        placeholder="City"
                                    />
                                    <FormInput
                                        label="Country"
                                        name="location.country"
                                        value={formData.location.country || ''}
                                        readOnly
                                        placeholder="Country"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Get Current Location
                                </button>
                        </div>
                    </section>


                        {/* Relationship Preferences */}
                        <section className="bg-neutral-100 rounded-2xl p-6 space-y-4 mb-8">
                                <FormSelect 
                                    label="Relationship Status" 
                                    name="relationshipStatus" 
                                    value={formData.relationshipStatus} 
                                    onChange={handleInputChange}
                                    options={[
                                        'Single', 
                                        'Divorced', 
                                        'Single parent', 
                                        'Separated', 
                                        'In a relationship', 
                                        'Complicated'
                                    ]}
                                />
                                <FormSelect 
                                    label="Interested In" 
                                    name="interestedIn" 
                                    value={formData.interestedIn} 
                                    onChange={handleInputChange}
                                    options={['Male', 'Female', 'Other']}
                                />
                            <div className="flex space-x-4">
                                <FormInput 
                                    label="Min Age" 
                                    name="preferenceAgeRange.min" 
                                    type="number" 
                                    value={formData.preferenceAgeRange.min} 
                                    onChange={handleInputChange} 
                                />
                                <FormInput 
                                    label="Max Age" 
                                    name="preferenceAgeRange.max" 
                                    type="number" 
                                    value={formData.preferenceAgeRange.max} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Reusable Form Input Component
const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, readOnly = false }) => (
    <div className="space-y-2 flex-1">
        <label className="text-neutral-600 text-sm">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-200 transition ${
                readOnly ? 'bg-gray-100' : ''
            }`}
        />
    </div>
);


// Reusable Form Select Component
const FormSelect = ({ label, name, value, onChange, options }) => (
    <div className="space-y-2">
        <label className="text-neutral-600 text-sm">{label}</label>
        <select 
            name={name}
            value={value} 
            onChange={onChange}
            className="w-full border border-neutral-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 transition"
        >
            <option value="">Select {label}</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

// Reusable Form Textarea Component
const FormTextarea = ({ label, name, value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-neutral-600 text-sm">{label}</label>
        <textarea 
            name={name}
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="w-full border border-neutral-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 transition"
        />
    </div>
);

export default EditProfile;