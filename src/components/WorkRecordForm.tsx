
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NewWorkRecord, ContributingEmployee } from "@/types/work-record";
import { Calculator, Save, Plus, Trash2, Users, AlertCircle } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validateWorkRecord } from "@/utils/validation";

interface WorkRecordFormProps {
  onSubmit: (record: NewWorkRecord) => void;
  initialData?: NewWorkRecord;
  isEditing?: boolean;
}

const WorkRecordForm = ({ onSubmit, initialData, isEditing = false }: WorkRecordFormProps) => {
  const { employees } = useEmployees();
  const [formData, setFormData] = useState<NewWorkRecord>(
    initialData || {
      employee_name: "",
      task_description: "",
      date: new Date().toISOString().split('T')[0],
      hours_spent: 0,
      hourly_rate: 0,
      additional_charges: 0,
      contributing_employees: [],
    }
  );

  const [contributingEmployees, setContributingEmployees] = useState<ContributingEmployee[]>(
    initialData?.contributing_employees || []
  );

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const calculateTotal = () => {
    return (formData.hours_spent * formData.hourly_rate) + formData.additional_charges;
  };

  const calculateProratedTotal = () => {
    const baseTotal = calculateTotal();
    const totalContributedHours = contributingEmployees.reduce((sum, emp) => sum + emp.contributed_hours, 0);
    const totalHours = formData.hours_spent + totalContributedHours;
    
    if (totalContributedHours === 0) return baseTotal;
    
    return {
      total: baseTotal,
      mainEmployee: {
        hours: formData.hours_spent,
        share: (formData.hours_spent / totalHours) * baseTotal
      },
      contributors: contributingEmployees.map(emp => ({
        ...emp,
        share: (emp.contributed_hours / totalHours) * baseTotal
      }))
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for validation
    const dataToValidate = {
      ...formData,
      contributing_employees: contributingEmployees.length > 0 ? contributingEmployees : undefined
    };

    // Validate form data
    const validation = validateWorkRecord(dataToValidate);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);

    const recordData = {
      ...formData,
      contributing_employees: contributingEmployees.length > 0 ? contributingEmployees : undefined
    };

    onSubmit(recordData);
    
    if (!isEditing) {
      setFormData({
        employee_name: "",
        task_description: "",
        date: new Date().toISOString().split('T')[0],
        hours_spent: 0,
        hourly_rate: 0,
        additional_charges: 0,
        contributing_employees: [],
      });
      setContributingEmployees([]);
    }
  };

  const handleInputChange = (field: keyof NewWorkRecord, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill hourly rate when employee is selected
    if (field === 'employee_name' && typeof value === 'string') {
      const selectedEmployee = employees.find(emp => emp.name === value);
      if (selectedEmployee && formData.hourly_rate === 0) {
        setFormData(prev => ({ ...prev, hourly_rate: selectedEmployee.hourly_rate }));
      }
    }
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const addContributingEmployee = () => {
    setContributingEmployees(prev => [...prev, {
      employee_id: "",
      employee_name: "",
      contributed_hours: 0
    }]);
  };

  const updateContributingEmployee = (index: number, field: keyof ContributingEmployee, value: string | number) => {
    setContributingEmployees(prev => prev.map((emp, i) => 
      i === index ? { ...emp, [field]: value } : emp
    ));
  };

  const removeContributingEmployee = (index: number) => {
    setContributingEmployees(prev => prev.filter((_, i) => i !== index));
  };

  const proratedData = calculateProratedTotal();
  const hasProratedCalculation = typeof proratedData === 'object' && 'contributors' in proratedData;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <span>{isEditing ? "Edit Record Pekerjaan" : "Tambah Record Pekerjaan Baru"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Terdapat kesalahan dalam form:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="employee_name">Nama Pegawai Utama *</Label>
              <Select value={formData.employee_name} onValueChange={(value) => handleInputChange("employee_name", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pegawai" />
                </SelectTrigger>
                <SelectContent>
                  {employees.filter(emp => emp.status === 'active').map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="task_description">Deskripsi Tugas *</Label>
            <Textarea
              id="task_description"
              value={formData.task_description}
              onChange={(e) => handleInputChange("task_description", e.target.value)}
              placeholder="Jelaskan detail tugas yang dikerjakan (minimal 10 karakter)..."
              rows={3}
              required
              minLength={10}
            />
            <div className="text-xs text-gray-500">
              {formData.task_description.length}/10 karakter minimum
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hours_spent">Jam Kerja Utama *</Label>
              <Input
                id="hours_spent"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={formData.hours_spent || ""}
                onChange={(e) => handleInputChange("hours_spent", parseFloat(e.target.value) || 0)}
                placeholder="0"
                required
              />
              <div className="text-xs text-gray-500">Maksimal 24 jam</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Tarif per Jam (Rp) *</Label>
              <Input
                id="hourly_rate"
                type="number"
                min="1000"
                max="10000000"
                value={formData.hourly_rate || ""}
                onChange={(e) => handleInputChange("hourly_rate", parseFloat(e.target.value) || 0)}
                placeholder="0"
                required
              />
              <div className="text-xs text-gray-500">Rp 1.000 - Rp 10.000.000</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional_charges">Biaya Tambahan (Rp)</Label>
              <Input
                id="additional_charges"
                type="number"
                min="0"
                value={formData.additional_charges || ""}
                onChange={(e) => handleInputChange("additional_charges", parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
              <div className="text-xs text-gray-500">Transport, makan, dll.</div>
            </div>
          </div>

          {/* Contributing Employees Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Pegawai Kolaborator (Opsional)</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContributingEmployee}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </Button>
            </div>
            
            {contributingEmployees.map((contributor, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <Label>Nama Pegawai</Label>
                  <Select 
                    value={contributor.employee_name} 
                    onValueChange={(value) => {
                      const selectedEmployee = employees.find(emp => emp.name === value);
                      updateContributingEmployee(index, "employee_name", value);
                      updateContributingEmployee(index, "employee_id", selectedEmployee?.id || "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pegawai" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter(emp => emp.name !== formData.employee_name && emp.status === 'active')
                        .filter(emp => !contributingEmployees.some((contrib, idx) => idx !== index && contrib.employee_name === emp.name))
                        .map((employee) => (
                        <SelectItem key={employee.id} value={employee.name}>
                          {employee.name} - {employee.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Jam Kontribusi</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={contributor.contributed_hours || ""}
                    onChange={(e) => updateContributingEmployee(index, "contributed_hours", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeContributingEmployee(index)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Calculation Display */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-blue-900">Total Remunerasi Keseluruhan:</span>
                <span className="text-xl font-bold text-blue-900">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </span>
              </div>
              
              {hasProratedCalculation && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-blue-900">Pembagian Prorata:</h4>
                  <div className="bg-white rounded p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{formData.employee_name} ({formData.hours_spent}h):</span>
                      <span className="font-medium">Rp {proratedData.mainEmployee.share.toLocaleString('id-ID')}</span>
                    </div>
                    {proratedData.contributors.map((contrib, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{contrib.employee_name} ({contrib.contributed_hours}h):</span>
                        <span className="font-medium">Rp {contrib.share.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={formData.employee_name === "" || formData.task_description.length < 10}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Update Record" : "Simpan Record"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkRecordForm;
