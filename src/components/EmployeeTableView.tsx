
import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface EmployeeTableViewProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeTableView = ({ employees, onEdit, onDelete }: EmployeeTableViewProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 p-3 text-left">Nama</th>
            <th className="border border-gray-300 p-3 text-left">Email</th>
            <th className="border border-gray-300 p-3 text-left">Telepon</th>
            <th className="border border-gray-300 p-3 text-left">Posisi</th>
            <th className="border border-gray-300 p-3 text-left">Departemen</th>
            <th className="border border-gray-300 p-3 text-left">Tanggal Bergabung</th>
            <th className="border border-gray-300 p-3 text-left">Tarif/Jam</th>
            <th className="border border-gray-300 p-3 text-left">Status</th>
            <th className="border border-gray-300 p-3 text-left">Total Jam</th>
            <th className="border border-gray-300 p-3 text-left">Total Pendapatan</th>
            <th className="border border-gray-300 p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-3 font-medium">{employee.name}</td>
              <td className="border border-gray-300 p-3">{employee.email}</td>
              <td className="border border-gray-300 p-3">{employee.phone}</td>
              <td className="border border-gray-300 p-3">{employee.position}</td>
              <td className="border border-gray-300 p-3">
                <Badge variant="outline">{employee.department}</Badge>
              </td>
              <td className="border border-gray-300 p-3">
                {format(new Date(employee.hire_date), "dd MMM yyyy", { locale: id })}
              </td>
              <td className="border border-gray-300 p-3">
                Rp {employee.hourly_rate.toLocaleString('id-ID')}
              </td>
              <td className="border border-gray-300 p-3">
                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                  {employee.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </td>
              <td className="border border-gray-300 p-3">{employee.total_hours_worked} jam</td>
              <td className="border border-gray-300 p-3 text-green-600 font-medium">
                Rp {employee.total_earnings.toLocaleString('id-ID')}
              </td>
              <td className="border border-gray-300 p-3">
                <div className="flex space-x-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(employee)}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(employee.id)}
                    className="hover:bg-red-50 hover:border-red-300 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTableView;
