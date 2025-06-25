import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize userLoggedIn from localStorage
  const [userLoggedIn, setUserLoggedIn] = useState(() => {
    const user = localStorage.getItem("user");
    return !!user; // Convert to boolean
  });

  // Update userLoggedIn when localStorage changes
  useEffect(() => {
    const checkUserLogin = () => {
      const user = localStorage.getItem("user");
      setUserLoggedIn(!!user);
    };
    
    // Check initial state
    checkUserLogin();
    
    // Add event listener for storage changes
    window.addEventListener('storage', checkUserLogin);
    
    return () => {
      window.removeEventListener('storage', checkUserLogin);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
