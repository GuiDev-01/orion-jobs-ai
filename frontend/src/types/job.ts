export interface Job {
  id: number;
  title: string;
  company: string;
  location?: string;
  work_modality: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
  url: string;
  remote?: boolean;
  contract_type?: string;
  tags: string[];
  created_at: string;
  source?: string;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  page_size: number;
}

export interface DailySummaryResponse {
  summary: {
    total_jobs: number;
    period_days: number;
    filters_applied: {
      location_filter: string | null;
      tags: string[] | null;
      limit: number;
    };
    top_companies: string[];
    work_modalities: string[];
    top_skills: string[];
  };
  jobs: Job[];
}

export interface DailySummary {
  total_jobs: number;
  new_today: number;
  top_companies: string[];
  work_modalities: string[];
}