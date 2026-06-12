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

  getMaxExerciceWeight: async (exerciceName) => {
    try {
      const response = await apiClient.get(`/exercices/maxByWeight`, {
        params: { param: exerciceName },
      });
      console.log(`🏋️‍♂️ Poids max pour ${exerciceName} :`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur récupération poids max pour ${exerciceName} :`, error);
      throw error;
    }
  },

  getExerciceNames: async () => {
    try {
      const response = await apiClient.get(`/exercices/getExerciceNames`);
      console.log("📋 Noms des exercices :", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération noms des exercices :", error);
      throw error;
    }
  },

  weightByTime: async (exerciceName) => {
    try {
      const response = await apiClient.get(`/exercices/weightByTime`, {
        params: { param: exerciceName },
      });
      console.log(`📈 Poids au fil du temps pour ${exerciceName} :`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur récupération poids au fil du temps pour ${exerciceName} :`, error);
      throw error;
    }
  },

  totalRepetitionsForWeek: async (startDate, endDate) => {
    try {
      const response = await apiClient.get(`/exercices/totalRepetitionsForWeek`, {
        params: { startDate, endDate },
      });
      console.log(`📊 Total répétitions du ${startDate} au ${endDate} :`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur récupération total répétitions pour la semaine :`, error);
      throw error;
    }
  },

  totalRepetitionsForMonthByName: async (exerciceName, startDate, endDate) => {
    try {
      const response = await apiClient.get(`/exercices/totalRepetitionsForMonthByName`, {
        params: { exerciceName, startDate, endDate },
      });
      console.log(`📊 Total répétitions pour ${exerciceName} du ${startDate} au ${endDate} :`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur récupération total répétitions pour ${exerciceName} :`, error);
      throw error;
    }
  },

  allByDateDesc: async () => {
    try {
      const response = await apiClient.get(`/exercices/allByDateDesc`);
      console.log("📋 Séances par date décroissante :", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération séances par date décroissante :", error);
      throw error;
    }
  },

  totalWeightForYear: async (year) => {
    try {
      const response = await apiClient.get(`/exercices/totalWeightForYear`, {
        params: { year },
      });
      console.log(`📊 Poids total pour l'année ${year} :`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur récupération poids total pour l'année ${year} :`, error);
      throw error;
    }
  },

  totalWeightForMonth: async (month, year) => {
    try {
      const response = await apiClient.get(`/exercices/totalWeightForMonth`, {
        params: { month, year },
      });
      console.log(`📊 Poids total pour le mois ${month}/${year} :`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur récupération poids total pour le mois ${month}/${year} :`, error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await apiClient.get("/users/");
      console.log("📋 Tous les utilisateurs :", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération tous les utilisateurs :", error);
      throw error;
    }
  },

  oneSeancesForAdmin: async (userId) => {
    try {
      const response = await apiClient.get(`/seances/oneSeancesForAdmin`, {
        params: { id: userId },
      });
      console.log(`🏋️‍♂️ Séances pour l'utilisateur #${userId} :`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur récupération séances pour l'utilisateur #${userId} :`, error);
      throw error;
    }
  },

  updateDateSeance: async (seanceId, newDate) => {
    try {
      const response = await apiClient.put(`/seances/${seanceId}/date/${newDate}`);
      console.log(`📅 Date de la séance #${seanceId} mise à jour :`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur mise à jour date de la séance #${seanceId} :`, error);
      throw error;
    }
  },



};

export default api;
