import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  allowedRoles,
  redirectPath = '/',
  children,
}) => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
        return <Navigate to={redirectPath} state={{ from: location }} replace/>;
    }
    
    if (!allowedRoles.includes(user.userRole)) {
        return <Navigate to="/forbidden" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;