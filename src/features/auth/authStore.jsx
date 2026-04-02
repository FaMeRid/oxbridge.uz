import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "oxbridge_user";
const STORAGE_TOKEN = "oxbridge_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveUser = useCallback((userData, token = null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      if (token) {
        localStorage.setItem(STORAGE_TOKEN, token);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TOKEN);
    }
    setError(null);
  }, []);

  // Google OAuth Login
  const googleLogin = useCallback(async (googleResponse) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));

      const { credential } = googleResponse;
      
      // Decode JWT token (without verification, for demo)
      const decodedToken = JSON.parse(atob(credential.split(".")[1]));

      const userData = {
        id: decodedToken.sub,
        email: decodedToken.email,
        displayName: decodedToken.name,
        picture: decodedToken.picture,
        provider: "google",
        loginTime: new Date().toISOString(),
      };

      saveUser(userData, credential);
      return userData;
    } catch (err) {
      const errorMessage = err.message || "Google login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [saveUser]);

  // Email/Password Login
  const emailLogin = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (!email.includes("@")) {
        throw new Error("Invalid email format");
      }

      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));

      const name = email.split("@")[0];
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);

      const userData = {
        id: `user_${Date.now()}`,
        email,
        displayName,
        picture: `https://ui-avatars.com/api/?name=${displayName}`,
        provider: "email",
        loginTime: new Date().toISOString(),
      };

      // Mock token
      const mockToken = btoa(JSON.stringify(userData));

      saveUser(userData, mockToken);
      return userData;
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [saveUser]);

  // Email/Password Register
  const emailRegister = useCallback(async (email, password, confirmPassword) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }

      if (!email.includes("@")) {
        throw new Error("Invalid email format");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Check if user already exists (mock)
      const existingUser = localStorage.getItem(STORAGE_KEY);
      if (existingUser) {
        const parsed = JSON.parse(existingUser);
        if (parsed.email === email) {
          throw new Error("This email is already registered");
        }
      }

      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));

      const name = email.split("@")[0];
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);

      const userData = {
        id: `user_${Date.now()}`,
        email,
        displayName,
        picture: `https://ui-avatars.com/api/?name=${displayName}`,
        provider: "email",
        loginTime: new Date().toISOString(),
      };

      const mockToken = btoa(JSON.stringify(userData));

      saveUser(userData, mockToken);
      return userData;
    } catch (err) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [saveUser]);

  const logout = useCallback(() => {
    saveUser(null);
  }, [saveUser]);

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    googleLogin,
    emailLogin,
    emailRegister,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthStore must be used inside AuthProvider");
  }
  return ctx;
}