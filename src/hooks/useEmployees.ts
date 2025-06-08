
import { useState, useEffect } from "react";
import { Employee, NewEmployee } from "@/types/employee";
import { toast } from "@/hooks/use-toast";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = () => {
      // Generate 100 dummy employees
      const sampleEmployees: Employee[] = [
        {
          id: "1",
          name: "Ahmad Fauzi",
          email: "ahmad.fauzi@company.com",
          phone: "+62 812-3456-7890",
          position: "Senior Developer",
          department: "IT",
          hire_date: "2023-01-15",
          hourly_rate: 150000,
          status: "active",
          total_hours_worked: 160,
          total_earnings: 24000000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Siti Nurhaliza",
          email: "siti.nurhaliza@company.com",
          phone: "+62 813-4567-8901",
          position: "UI/UX Designer",
          department: "Design",
          hire_date: "2023-03-20",
          hourly_rate: 120000,
          status: "active",
          total_hours_worked: 120,
          total_earnings: 14400000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      // Generate additional 98 employees
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

      const firstNames = [
        "Ahmad", "Siti", "Budi", "Rina", "Dedi", "Maya", "Agus", "Dewi", "Hendra", "Lestari",
        "Bambang", "Sri", "Eko", "Indah", "Joko", "Ratna", "Wawan", "Fitri", "Rudi", "Sari",
        "Tony", "Nita", "Andi", "Yuli", "Doni", "Eka", "Fajar", "Gita", "Hadi", "Irma"
      ];

      const lastNames = [
        "Wijaya", "Sari", "Pratama", "Utami", "Santoso", "Lestari", "Putra", "Kusuma",
        "Handoko", "Maharani", "Susanto", "Dewi", "Gunawan", "Pertiwi", "Kurniawan",
        "Anggraini", "Setiawan", "Rahayu", "Prabowo", "Cahyani"
      ];

      for (let i = 3; i <= 100; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const hourlyRate = Math.floor(Math.random() * 150000) + 50000; // 50k - 200k
        const totalHours = Math.floor(Math.random() * 200) + 50; // 50 - 250 hours
        const hireYear = 2020 + Math.floor(Math.random() * 4); // 2020-2023
        const hireMonth = Math.floor(Math.random() * 12) + 1;
        const hireDay = Math.floor(Math.random() * 28) + 1;

        sampleEmployees.push({
          id: i.toString(),
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
          phone: `+62 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
          position: position,
          department: department,
          hire_date: `${hireYear}-${hireMonth.toString().padStart(2, '0')}-${hireDay.toString().padStart(2, '0')}`,
          hourly_rate: hourlyRate,
          status: Math.random() > 0.1 ? "active" : "inactive",
          total_hours_worked: totalHours,
          total_earnings: totalHours * hourlyRate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      
      setEmployees(sampleEmployees);
      setIsLoading(false);
    };

    setTimeout(initializeData, 500);
  }, []);

  const addEmployee = (newEmployee: NewEmployee) => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
      total_hours_worked: 0,
      total_earnings: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEmployees(prev => [employee, ...prev]);
    toast({
      title: "Pegawai berhasil ditambahkan!",
      description: `${newEmployee.name} telah ditambahkan ke sistem.`,
    });
  };

  const updateEmployee = (id: string, updatedEmployee: NewEmployee) => {
    setEmployees(prev => prev.map(employee => 
      employee.id === id 
        ? {
            ...employee,
            ...updatedEmployee,
            updated_at: new Date().toISOString(),
          }
        : employee
    ));
    
    toast({
      title: "Data pegawai berhasil diupdate!",
      description: `Data ${updatedEmployee.name} telah diperbarui.`,
    });
  };

  const deleteEmployee = (id: string) => {
    const employee = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(employee => employee.id !== id));
    
    toast({
      title: "Pegawai berhasil dihapus!",
      description: employee ? `${employee.name} telah dihapus dari sistem.` : "Pegawai telah dihapus.",
      variant: "destructive",
    });
  };

  return {
    employees,
    isLoading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
