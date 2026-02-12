import axios from 'axios';
import type { JobsResponse, DailySummaryResponse, Job } from '../types/job';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

console.log('🔧 API Base URL:', baseURL);

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export const jobsApi = {
    getJobs: async (params?: {
        page?: number;
        page_size?: number;
        search?: string;
        remote?: boolean;
    }): Promise<JobsResponse> => {
        const {data} = await api.get('/jobs', { params });
        return data;
    },

    getJobById: async (id: number): Promise<Job> => {
        const { data } = await api.get(`/jobs/${id}`);
        return data;
    },

    getDailySummary: async (params?: {
        days?: number;
        remote_only?: boolean;
    }): Promise<DailySummaryResponse> => {
        console.log('📊 Fetching summary from:', api.defaults.baseURL + '/summary/daily');
        const { data } = await api.get('/summary/daily', { params });
        console.log('✅ Summary data received:', data);
        return data;
    },
};

export default api;