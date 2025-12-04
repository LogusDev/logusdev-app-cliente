import React, { createContext,useState } from "react";
import api from "../services/api.js";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await api.post('/clientes/login', credentials);
      setUser(response.data.cliente);
      setToken(response.data.token);
      return response.data;
  } catch (error) {
      throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
  }
  };

  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      console.log("Logout realizado com sucesso.")
    } catch (error) {
      console.log("Erro ao fazer logout: ", error);
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};