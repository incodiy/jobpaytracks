
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  hourly_rate: number;
  status: 'active' | 'inactive';
  avatar?: string;
  total_hours_worked: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface NewEmployee {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  hourly_rate: number;
  status: 'active' | 'inactive';
}
