import axios from "axios";

const API_URL = 'http://localhost:8080/api';


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
  },
});


export const authAPI = {
    login: (email,password) => api.post('/auth/login',{email,password}),
};

export const colisAPI = {
    getColisByClient: (clientId,page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => 
        api.get(`/colis/client/${clientId}`, {
            params: { page, size, sortBy, sortDir }
        }),
    getColisWithFilters: (clientId, filters) =>
        api.get(`/colis/client/${clientId}/filtered`,{
            params: filters
        }),
    getStatistics: (clientId, startDate, endDate) =>
        api.get(`/colis/client/${clientId}/statistics`,{
            params: { startDate , endDate }
        }),
    getStatusValues: () => api.get('/colis/status-values'),
    getFilteredStatistics: (clientId, filters) =>
        api.get(`/colis/client/${clientId}/statistics/filtered`, {
            params: filters
        }),
};


export default api;