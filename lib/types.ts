export type Plant = {
  id: string;
  user_id: string;
  name: string;
  variety_name: string;
  crop_name: string;
  category: string;
  location_type: string;
  planted_at: string;
  current_week: number;
  status: 'active' | 'harvested' | 'dead';
  cover_photo_url: string | null;
  created_at: string;
};

export type WeeklyTask = {
  id: string;
  plant_id: string;
  week_number: number;
  task: string;
  is_done: boolean;
  done_at: string | null;
  created_at: string;
};

export type WeeklyAnalysis = {
  id: string;
  plant_id: string;
  week_number: number;
  photo_url: string | null;
  ai_summary: string | null;
  tasks_for_next_week: string[];
  created_at: string;
};

export type AISettings = {
  id: string;
  user_id: string;
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  api_key_encrypted: string;
  model: string;
  custom_endpoint: string | null;
  is_active: boolean;
  updated_at: string;
};
