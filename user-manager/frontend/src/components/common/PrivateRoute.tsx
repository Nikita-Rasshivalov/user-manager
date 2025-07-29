import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserStatus } from "../../models/models";

const PrivateRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || user.status === UserStatus.BLOCKED) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default PrivateRoute;
