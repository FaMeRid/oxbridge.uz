// src/features/auth/useAuth.js
import { useAuthStore } from "./authStore";

export const useAuth = () => {
  const user     = useAuthStore((s) => s.user);
  const login    = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout   = useAuthStore((s) => s.logout);

  return {
    user,
    isAuth: !!user,
    login,
    register,
    logout,
  };
};
