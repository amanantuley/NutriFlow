"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem("nf_user_session");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    // Mock successful login
    const mockUser: User = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}`,
      targetCalories: 2100,
      targetProtein: 160,
      targetCarbs: 220,
      targetFats: 65,
    };
    setUser(mockUser);
    localStorage.setItem("nf_user_session", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nf_user_session");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
