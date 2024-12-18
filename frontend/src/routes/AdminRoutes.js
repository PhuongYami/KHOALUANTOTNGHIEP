import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserManagement from "../pages/Admin/UserManagement";

const AdminRoutes = [
    {
        path: "/admin/dashboard",
        element: (
            <ProtectedRoute>
                <AdminDashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/users",
        element: (
            <ProtectedRoute>
                <UserManagement />
            </ProtectedRoute>
        ),
    },
];

export default AdminRoutes;
