import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) return <Navigate to='/login' replace />;
  if (allowedRoles && !allowedRoles.includes(rol))
    return <Navigate to='/' replace />;

  return children;
};

export default ProtectedRoute;
