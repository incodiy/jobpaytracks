
import { useState } from "react";
import { WorkRecord } from "@/types/work-record";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, Calendar, Clock, DollarSign, User, Users, Search, Download } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ViewToggle from "./ViewToggle";
import WorkRecordTableView from "./WorkRecordTableView";

interface WorkRecordListProps {
  records: WorkRecord[];
  onEdit: (record: WorkRecord) => void;
  onDelete: (id: string) => void;
  onExport?: () => void;
  showForm: boolean;
  onToggleForm: () => void;
}

const WorkRecordList = ({ records, onEdit, onDelete, onExport, showForm, onToggleForm }: WorkRecordListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("all");
  const [view, setView] = useState<'card' | 'table'>('card');

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.task_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployee = filterEmployee === "all" || record.employee_name === filterEmployee;
    return matchesSearch && matchesEmployee;
  });

  const employees = [...new Set(records.map(record => record.employee_name))];

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada record pekerjaan</h3>
          <p className="text-gray-500">Mulai dengan menambahkan record pekerjaan pertama Anda.</p>
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
        formTitle="Form Record"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filter & Pencarian</CardTitle>
          {onExport && (
            <Button onClick={onExport} variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari record pekerjaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">Semua Pegawai</option>
              {employees.map(employee => (
                <option key={employee} value={employee}>{employee}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {view === 'table' ? (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Record Pekerjaan ({filteredRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkRecordTableView
              records={filteredRecords}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Daftar Record Pekerjaan ({filteredRecords.length})</h2>
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span>{record.employee_name}</span>
                      {record.contributing_employees && record.contributing_employees.length > 0 && (
                        <Badge variant="secondary" className="ml-2 flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>Kolaborasi</span>
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-2">{record.task_description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(record)}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(record.id)}
                      className="hover:bg-red-50 hover:border-red-300 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {format(new Date(record.date), "dd MMM yyyy", { locale: id })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{record.hours_spent} jam</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Rp {record.hourly_rate.toLocaleString('id-ID')}/jam</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      +Rp {record.additional_charges.toLocaleString('id-ID')} tambahan
                    </Badge>
                  </div>
                </div>

                {/* Contributing Employees Display */}
                {record.contributing_employees && record.contributing_employees.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2 flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Pegawai Kolaborator:</span>
                    </h4>
                    <div className="space-y-1">
                      {record.contributing_employees.map((contributor, idx) => (
                        <div key={idx} className="text-sm text-yellow-800 flex justify-between">
                          <span>{contributor.employee_name}</span>
                          <span>{contributor.contributed_hours} jam</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-900">Total Remunerasi:</span>
                    <span className="text-lg font-bold text-green-900">
                      Rp {record.total_remuneration.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    ({record.hours_spent} jam × Rp {record.hourly_rate.toLocaleString('id-ID')} + Rp {record.additional_charges.toLocaleString('id-ID')})
                    {record.contributing_employees && record.contributing_employees.length > 0 && (
                      <span className="block mt-1">
                        * Remunerasi dibagi prorata dengan {record.contributing_employees.length} pegawai kolaborator
                      </span>
                    )}
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

export default WorkRecordList;
