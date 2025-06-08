
import { WorkRecord } from "@/types/work-record";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface WorkRecordTableViewProps {
  records: WorkRecord[];
  onEdit: (record: WorkRecord) => void;
  onDelete: (id: string) => void;
}

const WorkRecordTableView = ({ records, onEdit, onDelete }: WorkRecordTableViewProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 p-3 text-left">Pegawai</th>
            <th className="border border-gray-300 p-3 text-left">Deskripsi Tugas</th>
            <th className="border border-gray-300 p-3 text-left">Tanggal</th>
            <th className="border border-gray-300 p-3 text-left">Jam Kerja</th>
            <th className="border border-gray-300 p-3 text-left">Tarif/Jam</th>
            <th className="border border-gray-300 p-3 text-left">Biaya Tambahan</th>
            <th className="border border-gray-300 p-3 text-left">Kolaborator</th>
            <th className="border border-gray-300 p-3 text-left">Total Remunerasi</th>
            <th className="border border-gray-300 p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-3 font-medium">{record.employee_name}</td>
              <td className="border border-gray-300 p-3 max-w-xs">
                <div className="line-clamp-2">{record.task_description}</div>
              </td>
              <td className="border border-gray-300 p-3">
                {format(new Date(record.date), "dd MMM yyyy", { locale: id })}
              </td>
              <td className="border border-gray-300 p-3">{record.hours_spent} jam</td>
              <td className="border border-gray-300 p-3">
                Rp {record.hourly_rate.toLocaleString('id-ID')}
              </td>
              <td className="border border-gray-300 p-3">
                Rp {record.additional_charges.toLocaleString('id-ID')}
              </td>
              <td className="border border-gray-300 p-3">
                {record.contributing_employees && record.contributing_employees.length > 0 ? (
                  <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                    <Users className="h-3 w-3" />
                    <span>{record.contributing_employees.length}</span>
                  </Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="border border-gray-300 p-3 text-green-600 font-medium">
                Rp {record.total_remuneration.toLocaleString('id-ID')}
              </td>
              <td className="border border-gray-300 p-3">
                <div className="flex space-x-2 justify-center">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkRecordTableView;
