
import { useState } from "react";
import { Employee } from "@/types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, User, Mail, Phone, Calendar, DollarSign, Search } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ViewToggle from "./ViewToggle";
import EmployeeTableView from "./EmployeeTableView";

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  showForm: boolean;
  onToggleForm: () => void;
}

const EmployeeList = ({ employees, onEdit, onDelete, showForm, onToggleForm }: EmployeeListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [view, setView] = useState<'card' | 'table'>('card');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];

  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data pegawai</h3>
          <p className="text-gray-500">Mulai dengan menambahkan pegawai pertama Anda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ViewToggle
        view={view}
        onViewChange={setView}
        showForm={showForm}
        onToggleForm={onToggleForm}
        formTitle="Form Pegawai"
      />

      <Card>
        <CardHeader>
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari pegawai..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">Semua Departemen</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {view === 'table' ? (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pegawai ({filteredEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeeTableView
              employees={filteredEmployees}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span>{employee.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                      <Badge variant="outline">{employee.department}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">{employee.position}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Bergabung: {format(new Date(employee.hire_date), "dd MMM yyyy", { locale: id })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>Rp {employee.hourly_rate.toLocaleString('id-ID')}/jam</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mt-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Total Jam:</span>
                        <p className="font-medium">{employee.total_hours_worked} jam</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Pendapatan:</span>
                        <p className="font-medium text-green-600">Rp {employee.total_earnings.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
