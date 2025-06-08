
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NewEmployee } from "@/types/employee";
import { UserPlus, Save, AlertCircle } from "lucide-react";
import { validateEmployee } from "@/utils/validation";

interface EmployeeFormProps {
  onSubmit: (employee: NewEmployee) => void;
  initialData?: NewEmployee;
  isEditing?: boolean;
}

const EmployeeForm = ({ onSubmit, initialData, isEditing = false }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<NewEmployee>(
    initialData || {
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      hire_date: new Date().toISOString().split('T')[0],
      hourly_rate: 0,
      status: "active",
    }
  );

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateEmployee(formData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);
    onSubmit(formData);
    
    if (!isEditing) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        hire_date: new Date().toISOString().split('T')[0],
        hourly_rate: 0,
        status: "active",
      });
    }
  };

  const handleInputChange = (field: keyof NewEmployee, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const departments = ["IT", "Design", "Marketing", "HR", "Finance", "Operations", "Sales", "Support"];
  const positions = [
    "Junior Developer", "Senior Developer", "Lead Developer", "Full Stack Developer",
    "Frontend Developer", "Backend Developer", "DevOps Engineer",
    "UI Designer", "UX Designer", "Graphic Designer", "Product Designer",
    "Marketing Manager", "Digital Marketing Specialist", "Content Creator",
    "HR Manager", "HR Specialist", "Recruiter",
    "Finance Manager", "Accountant", "Financial Analyst",
    "Operations Manager", "Project Manager", "Team Lead",
    "Sales Manager", "Sales Representative", "Business Development",
    "Customer Support", "Technical Support", "QA Engineer"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          <span>{isEditing ? "Edit Data Pegawai" : "Tambah Pegawai Baru"}</span>
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
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Masukkan nama lengkap (min. 2 karakter)"
                required
                minLength={2}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="nama@company.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+62 812-3456-7890 atau 0812-3456-7890"
                required
              />
              <div className="text-xs text-gray-500">Format Indonesia: +62xxx atau 08xxx</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hire_date">Tanggal Bergabung *</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => handleInputChange("hire_date", e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="department">Departemen *</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih departemen" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Posisi *</Label>
              <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih posisi" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "inactive") => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              placeholder="150000"
              required
            />
            <div className="text-xs text-gray-500">Rp 1.000 - Rp 10.000.000</div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!formData.name || !formData.email || !formData.department || !formData.position}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Update Pegawai" : "Tambah Pegawai"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
