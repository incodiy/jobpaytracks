
import { WorkRecord } from "@/types/work-record";
import { Employee } from "@/types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, FileText, TrendingUp, Users, Clock, DollarSign } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { id } from "date-fns/locale";

interface ReportsAnalyticsProps {
  records: WorkRecord[];
  employees: Employee[];
}

const ReportsAnalytics = ({ records, employees }: ReportsAnalyticsProps) => {
  // Calculate analytics data
  const totalRecords = records.length;
  const totalHours = records.reduce((sum, record) => sum + record.hours_spent, 0);
  const totalRemuneration = records.reduce((sum, record) => sum + record.total_remuneration, 0);
  const averageHourlyRate = records.length > 0 
    ? records.reduce((sum, record) => sum + record.hourly_rate, 0) / records.length 
    : 0;

  // Top employees by earnings
  const employeeEarnings = employees.map(employee => {
    const employeeRecords = records.filter(record => record.employee_name === employee.name);
    const earnings = employeeRecords.reduce((sum, record) => sum + record.total_remuneration, 0);
    const hours = employeeRecords.reduce((sum, record) => sum + record.hours_spent, 0);
    return {
      name: employee.name,
      earnings,
      hours,
      department: employee.department
    };
  }).sort((a, b) => b.earnings - a.earnings).slice(0, 5);

  // Department statistics
  const departmentStats = [...new Set(employees.map(emp => emp.department))].map(department => {
    const deptEmployees = employees.filter(emp => emp.department === department);
    const deptRecords = records.filter(record => 
      deptEmployees.some(emp => emp.name === record.employee_name)
    );
    
    return {
      department,
      employees: deptEmployees.length,
      hours: deptRecords.reduce((sum, record) => sum + record.hours_spent, 0),
      earnings: deptRecords.reduce((sum, record) => sum + record.total_remuneration, 0)
    };
  });

  // Monthly statistics (last 6 months)
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const monthlyStats = last6Months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });

    return {
      month: format(month, "MMM yyyy", { locale: id }),
      records: monthRecords.length,
      hours: monthRecords.reduce((sum, record) => sum + record.hours_spent, 0),
      earnings: monthRecords.reduce((sum, record) => sum + record.total_remuneration, 0)
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const exportData = (format: 'csv' | 'xlsx' | 'pdf') => {
    // This would typically integrate with a library like xlsx or jsPDF
    console.log(`Exporting data as ${format}`);
    // For demo purposes, we'll just show a toast
    alert(`Data akan diekspor dalam format ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Laporan & Analitik</h2>
        <div className="flex space-x-2">
          <Button onClick={() => exportData('csv')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => exportData('xlsx')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => exportData('pdf')} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jam Kerja</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Remunerasi</p>
                <p className="text-2xl font-bold text-gray-900">Rp {totalRemuneration.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata Tarif</p>
                <p className="text-2xl font-bold text-gray-900">Rp {averageHourlyRate.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Pendapatan Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']} />
                <Line type="monotone" dataKey="earnings" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Pendapatan per Departemen</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ department, earnings }) => `${department}: Rp ${earnings.toLocaleString('id-ID', { notation: 'compact' })}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="earnings"
                >
                  {departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Employees */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Pegawai Berdasarkan Pendapatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeeEarnings.map((employee, index) => (
              <div key={employee.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">Rp {employee.earnings.toLocaleString('id-ID')}</p>
                  <p className="text-sm text-gray-600">{employee.hours} jam</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik per Departemen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Departemen</th>
                  <th className="text-left p-4">Jumlah Pegawai</th>
                  <th className="text-left p-4">Total Jam</th>
                  <th className="text-left p-4">Total Pendapatan</th>
                  <th className="text-left p-4">Rata-rata per Pegawai</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept) => (
                  <tr key={dept.department} className="border-b">
                    <td className="p-4 font-medium">{dept.department}</td>
                    <td className="p-4">{dept.employees}</td>
                    <td className="p-4">{dept.hours} jam</td>
                    <td className="p-4 text-green-600 font-medium">Rp {dept.earnings.toLocaleString('id-ID')}</td>
                    <td className="p-4">Rp {dept.employees > 0 ? (dept.earnings / dept.employees).toLocaleString('id-ID') : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
