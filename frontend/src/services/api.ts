import axios from 'axios';
import type { JobsResponse, DailySummaryResponse, Job, AIAnalysisResponse } from '../types/job';

const normalizeBaseUrl = (url: string): string => {
    const trimmed = url.replace(/\/$/, '');
    return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
};

const rawApiUrl = import.meta.env.VITE_API_URL;
const baseURL = rawApiUrl
    ? normalizeBaseUrl(rawApiUrl)
    : import.meta.env.DEV
        ? '/api/v1'
        : 'https://orionjobs-api.azurewebsites.net/api/v1';

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

    analyzeJob: async (id: number): Promise<AIAnalysisResponse> => {
        const { data } = await api.get(`/ai/analyze-job/${id}`);
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