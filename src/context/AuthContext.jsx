import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("verifixCurrentUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("verifixCurrentUser");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("verifixCurrentUser", JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem("verifixUsers") || "[]");

    if (users.some((u) => u.email === userData.email)) {
      throw new Error("Bu email allaqachon ro'yxatdan o'tgan");
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("verifixUsers", JSON.stringify(users));

    login(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("verifixCurrentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedData) => {
    const users = JSON.parse(localStorage.getItem("verifixUsers") || "[]");
    const userIndex = users.findIndex((u) => u.id === currentUser.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem("verifixUsers", JSON.stringify(users));

      const updatedUser = users[userIndex];
      setCurrentUser(updatedUser);
      localStorage.setItem("verifixCurrentUser", JSON.stringify(updatedUser));

      return updatedUser;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;