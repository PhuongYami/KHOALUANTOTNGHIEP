import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearError, clearMessage } from "../features/auth/authSlice";
import { Lock, Activity } from 'lucide-react';

const ResetPassword = () => {
  const { resetToken } = useParams(); // Get token from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  // Validate password complexity
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    try {
      await dispatch(resetPassword({ resetToken, password, confirmPassword })).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Password reset failed:", err);
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
              Reset Password
            </h1>
            <p className="text-neutral-600 mb-6">
              Enter your new password below
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-300 rounded-lg p-4 text-center">
              {error}
            </div>
          )}

          {/* Success Notification */}
          {message && (
            <div className="text-green-600 bg-green-50 border border-green-300 rounded-lg p-4 text-center">
              {message}
            </div>
          )}

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-neutral-400" size={18} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm mt-2">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-neutral-400" size={18} />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {password !== confirmPassword && confirmPassword && (
                <p className="text-red-600 text-sm mt-2">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || passwordError || password !== confirmPassword}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                loading || passwordError || password !== confirmPassword
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-800 hover:bg-neutral-700 focus:ring-2 focus:ring-neutral-500'
              }`}
            >
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </form>

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
          Secure Reset • Protected Data
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;