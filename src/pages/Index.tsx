import { useState } from "react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import WorkRecordForm from "@/components/WorkRecordForm";
import WorkRecordList from "@/components/WorkRecordList";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeList from "@/components/EmployeeList";
import ReportsAnalytics from "@/components/ReportsAnalytics";
import Documentation from "@/components/Documentation";
import LicenseConfigPage from "@/components/LicenseConfigPage";
import UserManagementPage from "@/components/UserManagementPage";
import UserProfilePage from "@/components/UserProfilePage";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedView from "@/components/ProtectedView";
import { useWorkRecords } from "@/hooks/useWorkRecords";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/contexts/AuthContext";
import { WorkRecord, NewWorkRecord } from "@/types/work-record";
import { Employee, NewEmployee } from "@/types/employee";
import { Loader2 } from "lucide-react";
import { useLicense } from "@/hooks/useLicense";

const Index = () => {
  const { user } = useAuth();
  const { 
    records, 
    isLoading: recordsLoading, 
    addRecord, 
    updateRecord, 
    deleteRecord,
    exportToCSV 
  } = useWorkRecords();
  
  const { 
    employees, 
    isLoading: employeesLoading, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee 
  } = useEmployees();
  
  const { isDemoExpired } = useLicense();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showRecordForm, setShowRecordForm] = useState(true);
  const [showEmployeeForm, setShowEmployeeForm] = useState(true);

  const handleEditRecord = (record: WorkRecord) => {
    setEditingRecord(record);
    setActiveTab("records");
    setShowRecordForm(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setActiveTab("employees");
    setShowEmployeeForm(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleRecordFormSubmit = (formData: NewWorkRecord) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, formData);
      setEditingRecord(null);
    } else {
      addRecord(formData);
    }
  };

  const handleEmployeeFormSubmit = (formData: NewEmployee) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
      setEditingEmployee(null);
    } else {
      addEmployee(formData);
    }
  };

  const handleCancelEditRecord = () => {
    setEditingRecord(null);
  };

  const handleCancelEditEmployee = () => {
    setEditingEmployee(null);
  };

  const handleActivateLicense = () => {
    window.location.reload();
  };

  const isLoading = recordsLoading || employeesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <ProtectedView onActivateLicense={handleActivateLicense}>
            <Dashboard records={records} employees={employees} />
          </ProtectedView>
        );
      
      case "records":
        return (
          <ProtectedRoute roles={['admin', 'employee']}>
            <div className={`grid gap-8 ${showRecordForm ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {showRecordForm && (
                <div className="lg:col-span-1">
                  <WorkRecordForm
                    onSubmit={handleRecordFormSubmit}
                    initialData={editingRecord ? {
                      employee_name: editingRecord.employee_name,
                      task_description: editingRecord.task_description,
                      date: editingRecord.date,
                      hours_spent: editingRecord.hours_spent,
                      hourly_rate: editingRecord.hourly_rate,
                      additional_charges: editingRecord.additional_charges,
                      contributing_employees: editingRecord.contributing_employees,
                    } : undefined}
                    isEditing={!!editingRecord}
                  />
                  {editingRecord && (
                    <button
                      onClick={handleCancelEditRecord}
                      className="w-full mt-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              )}
              
              <div className={showRecordForm ? "lg:col-span-2" : "col-span-1"}>
                <ProtectedView onActivateLicense={handleActivateLicense}>
                  <WorkRecordList
                    records={records}
                    onEdit={handleEditRecord}
                    onDelete={deleteRecord}
                    onExport={exportToCSV}
                    showForm={showRecordForm}
                    onToggleForm={() => setShowRecordForm(!showRecordForm)}
                  />
                </ProtectedView>
              </div>
            </div>
          </ProtectedRoute>
        );
      
      case "employees":
        return (
          <ProtectedRoute roles={['admin']}>
            <div className={`grid gap-8 ${showEmployeeForm ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {showEmployeeForm && (
                <div className="lg:col-span-1">
                  <EmployeeForm
                    onSubmit={handleEmployeeFormSubmit}
                    initialData={editingEmployee ? {
                      name: editingEmployee.name,
                      email: editingEmployee.email,
                      phone: editingEmployee.phone,
                      position: editingEmployee.position,
                      department: editingEmployee.department,
                      hire_date: editingEmployee.hire_date,
                      hourly_rate: editingEmployee.hourly_rate,
                      status: editingEmployee.status,
                    } : undefined}
                    isEditing={!!editingEmployee}
                  />
                  {editingEmployee && (
                    <button
                      onClick={handleCancelEditEmployee}
                      className="w-full mt-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              )}
              
              <div className={showEmployeeForm ? "lg:col-span-2" : "col-span-1"}>
                <ProtectedView onActivateLicense={handleActivateLicense}>
                  <EmployeeList
                    employees={employees}
                    onEdit={handleEditEmployee}
                    onDelete={deleteEmployee}
                    showForm={showEmployeeForm}
                    onToggleForm={() => setShowEmployeeForm(!showEmployeeForm)}
                  />
                </ProtectedView>
              </div>
            </div>
          </ProtectedRoute>
        );
      
      case "reports":
        return (
          <ProtectedRoute roles={['admin', 'viewer']}>
            <ProtectedView onActivateLicense={handleActivateLicense}>
              <ReportsAnalytics records={records} employees={employees} />
            </ProtectedView>
          </ProtectedRoute>
        );

      case "license-config":
        return (
          <ProtectedRoute roles={['admin']}>
            <LicenseConfigPage />
          </ProtectedRoute>
        );
      
      case "user-management":
        return (
          <ProtectedRoute roles={['admin']}>
            <UserManagementPage />
          </ProtectedRoute>
        );

      case "profile":
        return <UserProfilePage />;
      
      case "documents":
        return <Documentation />;
      
      default:
        return (
          <ProtectedView onActivateLicense={handleActivateLicense}>
            <Dashboard records={records} employees={employees} />
          </ProtectedView>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
