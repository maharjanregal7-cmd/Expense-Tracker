import axios from "axios";

const API_URL = "http://localhost:8000/api/";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

export const register = (userData) => api.post("register/", userData);

export const login = (credentials) => api.post("login/", credentials);

export const getCurrentUser = () => api.post("user/");

export const getExpenses = (params) => api.get("expenses/", { params });

export const createExpense = (data) => api.post("expenses/", data);

export const updateExpense = (id, data) => api.put(`expenses/${id}/`, data);

export const deleteExpense = (id) => api.delete(`expenses/${id}/`);
