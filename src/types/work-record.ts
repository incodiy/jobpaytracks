
export interface WorkRecord {
  id: string;
  employee_name: string;
  task_description: string;
  date: string;
  hours_spent: number;
  hourly_rate: number;
  additional_charges: number;
  total_remuneration: number;
  contributing_employees?: ContributingEmployee[];
  created_at: string;
  updated_at: string;
}

export interface NewWorkRecord {
  employee_name: string;
  task_description: string;
  date: string;
  hours_spent: number;
  hourly_rate: number;
  additional_charges: number;
  contributing_employees?: ContributingEmployee[];
}

export interface ContributingEmployee {
  employee_id: string;
  employee_name: string;
  contributed_hours: number;
}
