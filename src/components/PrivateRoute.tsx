import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  allowedRoles: string[];
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !role) {
    return <Navigate to="/" replace />;
  }

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
