import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import VerificationRequests from "../pages/ThirdParty/VerificationRequests";

const ThirdPartyRoutes = [
    {
        path: "/third-party/requests",
        element: (
            <ProtectedRoute>
                <VerificationRequests />
            </ProtectedRoute>
        ),
    },
];

export default ThirdPartyRoutes;
