import React from "react";
import { Route, Redirect } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";

export function ProtectedRoute({ path, component: Component, ...props }) {
  const { isAuthenticated } = useAuthStore();

  return (
    <Route path={path} {...props}>
      {isAuthenticated ? (
        <Component />
      ) : (
        <Redirect to="/login" />
      )}
    </Route>
  );
}

export default ProtectedRoute;