import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { refreshAccessToken, fetchCurrentUser } from "./features/auth/authSlice";
import Navbar from "./components/Navbar";
import allRoutes from "./routes";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <div className="text-center">
        <div className="animate-pulse">
          <img 
            src="/logo.svg"
            alt="ELITE Logo" 
           className="mx-auto h-80 w-80 mb-4 animate-pulse"
          />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const path = window.location.pathname;

        if (!["/login", "/register", "/reset-password"].includes(path)) {
          await dispatch(refreshAccessToken()).unwrap();
          await dispatch(fetchCurrentUser()).unwrap();
        }
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      } finally {
        // Thêm delay để người dùng có thể nhìn thấy splash screen
        setTimeout(() => {
          setIsAuthInitialized(true);
        }, 1500); // Có thể điều chỉnh thời gian
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (!isAuthInitialized) {
    return <SplashScreen />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Navbar />
        <Routes>
          {allRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Routes>
      </Router>
    </>
  );
};

export default App;