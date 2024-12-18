import React from "react";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Điều hướng tới endpoint của backend
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
window.location.href = `${backendUrl}/api/v1/auth/google`.replace(/([^:]\/)\/+/g, "$1");
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
      >
        Login by Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
