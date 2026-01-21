import axios from 'axios';
import type { JobsResponse, DailySummaryResponse, Job } from '../types/job';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
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
        const { data } = await api.get('/summary/daily', { params });
        return data;
    },
};

export default api;