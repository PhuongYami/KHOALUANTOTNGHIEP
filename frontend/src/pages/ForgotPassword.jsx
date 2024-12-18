import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, clearMessage } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Mail, Activity } from 'lucide-react';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        // Optionally, you could add a success state or redirect
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-thin text-neutral-800 mb-2 flex items-center justify-center">
              Forgot Password
            </h1>
            <p className="text-neutral-600 mb-6">
              Enter your email to reset your password
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="text-green-600 bg-green-50 border border-green-300 rounded-lg p-4 text-center">
              {message}
            </div>
          )}

          {/* Error Notification */}
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-300 rounded-lg p-4 text-center">
              {error}
            </div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-neutral-400" size={18} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {loading ? 'Sending Reset Link...' : 'Reset Password'}
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

export default ForgotPassword;