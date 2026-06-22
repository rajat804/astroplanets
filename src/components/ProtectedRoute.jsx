import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    // ✅ Save redirect path in sessionStorage
    sessionStorage.setItem('redirect_after_login', window.location.pathname);
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

export default ProtectedRoute;