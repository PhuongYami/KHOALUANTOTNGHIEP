import React from "react";
import { Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import OTPVerification from "../pages/OTPVerification";
import GoogleCallbackHandler from "../components/GoogleCallbackHandler";

const PublicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password/:resetToken", element: <ResetPassword /> },
    { path: "/otp-verification", element: <OTPVerification /> },
    { path: "/google-callback/:token", element: <GoogleCallbackHandler /> },
];

export default PublicRoutes;
