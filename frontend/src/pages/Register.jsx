import React, { useState } from "react";
import { MapPin, Loader2, Users, Mail, Lock, Phone, Calendar, Compass } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from '../components/GoogleLoginButton';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    location: {
      coordinates: [0, 0],
      city: "",
      country: "",
      isDetecting: false,
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      location: {
        ...prevState.location,
        [name]: value,
      },
    }));
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      setFormData((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          isDetecting: true,
        },
      }));

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            setFormData((prevState) => ({
              ...prevState,
              location: {
                coordinates: [longitude, latitude],
                city:
                  data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  "",
                country: data.address.country || "",
                isDetecting: false,
              },
            }));
          } catch (error) {
            console.error("Location info retrieval error:", error);
            setFormData((prevState) => ({
              ...prevState,
              location: {
                ...prevState.location,
                coordinates: [longitude, latitude],
                isDetecting: false,
              },
            }));
          }
        },
        (error) => {
          console.error("Location error:", error);
          setFormData((prevState) => ({
            ...prevState,
            location: {
              ...prevState.location,
              isDetecting: false,
            },
          }));
          alert("Unable to detect location. Please enter manually.");
        }
      );
    } else {
      alert("Your browser does not support geolocation.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      console.log(result);
      alert("OTP has been sent to your email. Please check!");
      navigate("/otp-verification", { state: { email: formData.email } });
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-thin text-neutral-800 mb-2 flex items-center justify-center">
              <Users className="mr-3 text-neutral-600" />
              Create Account
            </h1>
            <p className="text-neutral-600 mb-6">Join our community today</p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-300 rounded-lg p-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Users className="absolute left-3 top-3 text-neutral-400" size={18} />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Users className="absolute left-3 top-3 text-neutral-400" size={18} />
              </div>
            </div>

            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Users className="absolute left-3 top-3 text-neutral-400" size={18} />
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Mail className="absolute left-3 top-3 text-neutral-400" size={18} />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Lock className="absolute left-3 top-3 text-neutral-400" size={18} />
            </div>

            {/* Phone Input */}
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Phone className="absolute left-3 top-3 text-neutral-400" size={18} />
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute left-3 top-3 text-neutral-400" size={18} />
            </div>

            {/* Gender Select */}
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <Users className="absolute left-3 top-3 text-neutral-400" size={18} />
            </div>

            {/* Location Inputs */}
            <div className="space-y-4">
              <div className="relative flex items-center space-x-2">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    name="city"
                    value={formData.location.city}
                    onChange={handleLocationChange}
                    placeholder="City"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Compass className="absolute left-3 top-3 text-neutral-400" size={18} />
                </div>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={formData.location.isDetecting}
                  className="p-3 border border-neutral-200 rounded-lg hover:bg-neutral-100 disabled:opacity-50 transition"
                >
                  {formData.location.isDetecting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <MapPin className="h-5 w-5 text-neutral-600" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="country"
                  value={formData.location.country}
                  onChange={handleLocationChange}
                  placeholder="Country"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Compass className="absolute left-3 top-3 text-neutral-400" size={18} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                loading
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-800 hover:bg-neutral-700 focus:ring-2 focus:ring-neutral-500'
              }`}
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-1 border-neutral-200" />
              <span className="px-4 text-sm text-neutral-500">OR</span>
              <hr className="flex-1 border-neutral-200" />
            </div>

            {/* Social Login */}
            <div className="text-center">
              <GoogleLoginButton />
            </div>

            {/* Login Redirect */}
            <p className="text-center text-sm text-neutral-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;