
export interface ReportData {
  totalRecords: number;
  totalEmployees: number;
  totalHours: number;
  totalRemuneration: number;
  averageHourlyRate: number;
  topEmployees: {
    name: string;
    hours: number;
    earnings: number;
  }[];
  departmentStats: {
    department: string;
    employees: number;
    hours: number;
    earnings: number;
  }[];
  monthlyStats: {
    month: string;
    records: number;
    hours: number;
    earnings: number;
  }[];
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  dateRange: {
    start: string;
    end: string;
  };
  includeFields: string[];
}
