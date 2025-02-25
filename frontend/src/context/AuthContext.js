import { createContext, useContext, useState } from "react";
import api from "../utils/api"; // Ensure API requests are configured correctly

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (formData) => {
    try {
      const response = await api.post("/auth/register", formData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.token);
        return true;
      }
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
