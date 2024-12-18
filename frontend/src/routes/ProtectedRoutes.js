import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Discover from "../pages/Discover/Discover";
import Messages from "../pages/Messages";
import Activities from "../pages/Activities";
import Search from "../pages/AdvancedSearch/Search";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import AccountInfo from "../pages/AccountInfo";
import UserProfile from "../pages/UserProfile";

const ProtectedRoutes = [
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/discover",
        element: (
            <ProtectedRoute>
                <Discover />
            </ProtectedRoute>
        ),
    },
    {
        path: "/messages",
        element: (
            <ProtectedRoute>
                <Messages />
            </ProtectedRoute>
        ),
    },
    {
        path: "/messages/:userId",
        element: (
            <ProtectedRoute>
                <Messages />
            </ProtectedRoute>
        ),
    },
    {
        path: "/activities",
        element: (
            <ProtectedRoute>
                <Activities />
            </ProtectedRoute>
        ),
    },
    {
        path: "/search",
        element: (
            <ProtectedRoute>
                <Search />
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        ),
    },
    {
        path: "/edit-profile",
        element: (
            <ProtectedRoute>
                <EditProfile />
            </ProtectedRoute>
        ),
    },
    {
        path: "/account-settings",
        element: (
            <ProtectedRoute>
                <AccountInfo />
            </ProtectedRoute>
        ),
    },
    {
        path: "/user-profile/:userId",
        element: (
            <ProtectedRoute>
                <UserProfile />
            </ProtectedRoute>
        ),
    },
];

export default ProtectedRoutes;
