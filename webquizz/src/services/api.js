import axios from 'axios';

// API-Basis-URL
const API_URL = process.env.REACT_APP_API_URL || '';

// Axios-Instanz mit Basiseinstellungen
const api = axios.create({
  baseURL: API_URL
});

// Request-Interceptor für den Auth-Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quizToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API-Funktionen exportieren
export const fetchCategories = () => api.get('/categories');
export const fetchQuestions = (categoryId) => api.get(`/questions?category=${categoryId}`);
export const fetchHighscores = () => api.get('/highscores');
export const saveHighscore = (data) => api.post('/highscores', data);
export const login = (credentials) => api.post('/login', credentials);
export const register = (userData) => api.post('/register', userData);
export const submitQuestion = (question) => api.post('/questions', question);

export default api;