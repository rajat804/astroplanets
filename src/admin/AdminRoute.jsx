import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    const admin = sessionStorage.getItem('admin');
    console.log("AdminRoute Mounted");
      console.log("TOKEN:", token);
      console.log("ADMIN:", admin);
    console.log('🔍 AdminRoute check:', { token: !!token, admin: !!admin });
    setAuthenticated(!!token && !!admin);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;