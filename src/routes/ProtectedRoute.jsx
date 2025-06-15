import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role_name)) {
        return <Navigate to="/not-found" replace />;
    }

    return children;
}