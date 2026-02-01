import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export const AdminRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return element;
};
