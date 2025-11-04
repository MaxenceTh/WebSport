import axios from "axios";

// Création d'une instance Axios configurée
const apiClient = axios.create({
  baseURL: "http://localhost:8005",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter automatiquement le token (si présent)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fonctions d'appel à l'API
const api = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const token = response.data.token;

      // Stocker le token
      localStorage.setItem("token", token);

      console.log("✅ Token enregistré :", token);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur de connexion :", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    console.log("✅ Déconnecté");
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/users/me");
      console.log("👤 Utilisateur connecté :", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération utilisateur :", error);
      throw error;
    }
  },

  getSeance: async (seanceId) => {
    try {
      const response = await apiClient.get(`/seances/${seanceId}`);
      console.log("🏋️‍♂️ Séance récupérée :", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération séance :", error);
      throw error;
    }
  },

  getAllSeances: async () => {
    try {
      const response = await apiClient.get("/seances/allSeance");
      console.log("📋 Toutes les séances :", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération toutes les séances :", error);
      throw error;
    }
  },

  createSeance: async (seanceData) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.post(`/seances/create`, seanceData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

};

export default api;
