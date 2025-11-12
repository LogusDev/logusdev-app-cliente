import React, { createContext,useState } from "react";
import api from "../services/api.js";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await api.post('/clientes/login', credentials);

      const userData = {
        ...response.data.cliente,
        token: response.data.token,
      }

      setUser(userData)
      return response.data;
  } catch (error) {
      throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
  }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login }}>
      {children}
    </UserContext.Provider>
  );
};