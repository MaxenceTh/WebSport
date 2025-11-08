import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api/api'; 

export const AuthContext = createContext();

export function AuthenticationProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthenticationProvider.propTypes = {
  children: PropTypes.node
};
