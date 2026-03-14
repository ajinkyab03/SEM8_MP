import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useContext(authContext);

  const isValidJwt = token && token.split(".").length === 3;
  const isAllowed = allowedRoles.includes(role);
  const accessibleRoute =
    isValidJwt && isAllowed ? children : <Navigate to="/login" replace={true} />;

  return accessibleRoute;
};

export default ProtectedRoute;
