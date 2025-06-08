
import { WorkRecord } from "@/types/work-record";
import { Employee } from "@/types/employee";
import StatCard from "./StatCard";
import RecentWorkRecords from "./RecentWorkRecords";
import { TrendingUp, Users, Clock, DollarSign, Calendar, Award, Target, Activity } from "lucide-react";

interface DashboardProps {
  records: WorkRecord[];
  employees: Employee[];
}

const Dashboard = ({ records, employees }: DashboardProps) => {
  const totalRecords = records.length;
  const totalHours = records.reduce((sum, record) => sum + record.hours_spent, 0);
  const totalRemuneration = records.reduce((sum, record) => sum + record.total_remuneration, 0);
  const uniqueEmployees = new Set(records.map(record => record.employee_name)).size;

  // Additional statistics
  const avgHourlyRate = totalHours > 0 ? totalRemuneration / totalHours : 0;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const thisMonthRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
  });
  const thisMonthEarnings = thisMonthRecords.reduce((sum, record) => sum + record.total_remuneration, 0);

  const stats = [
    {
      title: "Total Records",
      value: totalRecords.toString(),
      icon: TrendingUp,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      trend: "+12% dari bulan lalu",
      description: "Total catatan pekerjaan"
    },
    {
      title: "Total Pegawai",
      value: employees.length.toString(),
      icon: Users,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      description: `${activeEmployees} aktif dari ${employees.length} total`
    },
    {
      title: "Total Jam Kerja",
      value: `${totalHours.toFixed(1)} jam`,
      icon: Clock,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      description: "Akumulasi jam kerja"
    },
    {
      title: "Total Remunerasi",
      value: `Rp ${totalRemuneration.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      trend: "+8% dari bulan lalu",
      description: "Total pendapatan"
    },
    {
      title: "Records Bulan Ini",
      value: thisMonthRecords.length.toString(),
      icon: Calendar,
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      description: "Catatan bulan berjalan"
    },
    {
      title: "Pendapatan Bulan Ini",
      value: `Rp ${thisMonthEarnings.toLocaleString('id-ID')}`,
      icon: Award,
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
      description: "Earning bulan ini"
    },
    {
      title: "Rata-rata Tarif/Jam",
      value: `Rp ${avgHourlyRate.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`,
      icon: Target,
      color: "bg-gradient-to-r from-cyan-500 to-cyan-600",
      description: "Average hourly rate"
    },
    {
      title: "Pegawai Aktif",
      value: `${((activeEmployees / employees.length) * 100).toFixed(1)}%`,
      icon: Activity,
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      description: `${activeEmployees} dari ${employees.length} pegawai`
    }
  ];

  // Get recent 20 work records
  const recentRecords = records
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600 mb-6">
          Ringkasan lengkap sistem pencatatan pekerjaan dan remunerasi pegawai
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Recent Work Records Section */}
      <RecentWorkRecords records={recentRecords} />
    </div>
  );
};

export default Dashboard;
