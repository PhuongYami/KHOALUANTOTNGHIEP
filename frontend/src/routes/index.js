import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminRoutes from "./AdminRoutes";
import ThirdPartyRoutes from "./ThirdPartyRoutes";

const allRoutes = [
    ...PublicRoutes,
    ...ProtectedRoutes,
    ...AdminRoutes,
    ...ThirdPartyRoutes,
];

export default allRoutes;
