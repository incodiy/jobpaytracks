
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Users } from "lucide-react";

interface ProratedData {
  total: number;
  mainEmployee: {
    hours: number;
    share: number;
  };
  contributors: Array<{
    employee_name: string;
    contributed_hours: number;
    share: number;
  }>;
}

interface ProratedCalculationProps {
  data: ProratedData;
  mainEmployeeName: string;
}

const ProratedCalculation = ({ data, mainEmployeeName }: ProratedCalculationProps) => {
  const totalHours = data.mainEmployee.hours + data.contributors.reduce((sum, emp) => sum + emp.contributed_hours, 0);
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-900">
          <Calculator className="h-5 w-5" />
          <span>Perhitungan Remunerasi Prorata</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-900">Total Remunerasi Keseluruhan:</span>
            <span className="text-xl font-bold text-green-600">
              Rp {data.total.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Total Jam Kerja: {totalHours} jam
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Pembagian Per Pegawai:</span>
          </h4>
          
          {/* Main Employee */}
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant="default">Utama</Badge>
                <span className="font-medium">{mainEmployeeName}</span>
              </div>
              <span className="font-bold text-blue-600">
                Rp {data.mainEmployee.share.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {data.mainEmployee.hours} jam ({((data.mainEmployee.hours / totalHours) * 100).toFixed(1)}%)
            </div>
          </div>

          {/* Contributing Employees */}
          {data.contributors.map((contributor, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Kolaborator</Badge>
                  <span className="font-medium">{contributor.employee_name}</span>
                </div>
                <span className="font-bold text-purple-600">
                  Rp {contributor.share.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {contributor.contributed_hours} jam ({((contributor.contributed_hours / totalHours) * 100).toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-sm text-yellow-800">
            <strong>Catatan:</strong> Remunerasi dibagi secara proporsional berdasarkan jam kerja masing-masing pegawai. 
            Formula: (Jam Kerja Individual / Total Jam Kerja) × Total Remunerasi
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProratedCalculation;
