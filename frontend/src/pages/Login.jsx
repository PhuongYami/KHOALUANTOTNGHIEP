import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, clearMessage } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Users, Activity } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard');
      }
    });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-thin text-neutral-800 mb-2 flex items-center justify-center">
              <Users className="mr-3 text-neutral-600" />
              Welcome Back
            </h1>
            <p className="text-neutral-600 mb-6">Sign in to continue to your dashboard</p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-300 rounded-lg p-4 text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
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
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-neutral-400" size={18} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
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
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

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

          {/* Register Redirect */}
          <p className="text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline font-medium"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* Additional Decorative Element */}
        <div className="mt-8 text-center flex justify-center items-center text-neutral-500">
          <Activity className="mr-2" size={20} />
          Secure Login • Protected Data
        </div>
      </div>
    </div>
  );
};

export default Login;