import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmailOTP, sendMailOTP, setAuth, clearError } from "../features/auth/authSlice";
import { Lock, Mail, Activity } from 'lucide-react';

const OTPVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from registration state
  const email = location.state?.email || "";

  const { loading, error } = useSelector((state) => state.auth);

  const [otpCode, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (e) => {
    // Ensure only numbers are entered
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      return;
    }

    try {
      const result = await dispatch(verifyEmailOTP({ email, otpCode })).unwrap();
      const { user, token } = result;
      dispatch(setAuth({ user, token }));
      navigate("/dashboard");
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await dispatch(sendMailOTP({ email })).unwrap();
    } catch (err) {
      console.error("Resend OTP failed:", err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-thin text-neutral-800 mb-2 flex items-center justify-center">
              <Lock className="mr-3 text-neutral-600" />
              Verify OTP
            </h1>
            <p className="text-neutral-600 mb-6">
              Enter the 6-digit code sent to {email}
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-300 rounded-lg p-4 text-center">
              {error}
            </div>
          )}

          {/* OTP Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-2">
                OTP Code
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-neutral-400" size={18} />
                <input
                  type="text"
                  id="otp"
                  value={otpCode}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  className="w-full pl-10 pr-4 py-3 text-center border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          {/* Resend OTP */}
          <p className="text-center text-sm text-neutral-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-blue-600 hover:underline font-medium disabled:opacity-50"
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          </p>

          {/* Back to Login */}
          <p className="text-center text-sm text-neutral-600">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Login
            </button>
          </p>
        </div>

        {/* Additional Decorative Element */}
        <div className="mt-8 text-center flex justify-center items-center text-neutral-500">
          <Activity className="mr-2" size={20} />
          Secure Verification • Protected Data
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;