
import { useState, useEffect } from "react";
import { WorkRecord, NewWorkRecord } from "@/types/work-record";
import { toast } from "@/hooks/use-toast";

export const useWorkRecords = () => {
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = () => {
      // Generate 50 dummy work records
      const employeeNames = [
        "Ahmad Fauzi", "Siti Nurhaliza", "Budi Santoso", "Rina Wijaya", "Dedi Pratama",
        "Maya Lestari", "Agus Gunawan", "Dewi Sari", "Hendra Kusuma", "Lestari Dewi",
        "Bambang Setiawan", "Sri Rahayu", "Eko Prabowo", "Indah Cahyani", "Joko Susanto"
      ];

      const taskDescriptions = [
        "Pengembangan fitur login dan registrasi untuk aplikasi mobile banking",
        "Desain UI/UX untuk dashboard admin sistem inventory",
        "Implementasi API payment gateway dengan third party service",
        "Optimisasi database query untuk meningkatkan performa sistem",
        "Pengembangan modul laporan keuangan bulanan",
        "Integrasi sistem CRM dengan platform email marketing",
        "Pembuatan dokumentasi teknis untuk API endpoints",
        "Testing dan debugging aplikasi web e-commerce",
        "Implementasi sistem notifikasi real-time",
        "Pengembangan fitur chat customer service",
        "Analisis keamanan aplikasi dan penetration testing",
        "Migrasi data dari sistem lama ke sistem baru",
        "Pengembangan aplikasi mobile untuk iOS dan Android",
        "Implementasi sistem backup dan disaster recovery",
        "Optimisasi SEO dan performance website"
      ];

      const sampleRecords: WorkRecord[] = [];

      for (let i = 1; i <= 50; i++) {
        const employeeName = employeeNames[Math.floor(Math.random() * employeeNames.length)];
        const taskDescription = taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)];
        const hoursSpent = Math.floor(Math.random() * 10) + 1; // 1-10 hours
        const hourlyRate = Math.floor(Math.random() * 100000) + 100000; // 100k-200k
        const additionalCharges = Math.floor(Math.random() * 100000); // 0-100k
        const totalRemuneration = (hoursSpent * hourlyRate) + additionalCharges;
        
        // Random date within last 6 months
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 180));
        const dateString = date.toISOString().split('T')[0];

        // Randomly add contributing employees (30% chance)
        const contributingEmployees = Math.random() > 0.7 ? [
          {
            employee_id: (Math.floor(Math.random() * 15) + 1).toString(),
            employee_name: employeeNames[Math.floor(Math.random() * employeeNames.length)],
            contributed_hours: Math.floor(Math.random() * 3) + 1
          }
        ] : undefined;

        sampleRecords.push({
          id: i.toString(),
          employee_name: employeeName,
          task_description: taskDescription,
          date: dateString,
          hours_spent: hoursSpent,
          hourly_rate: hourlyRate,
          additional_charges: additionalCharges,
          total_remuneration: totalRemuneration,
          contributing_employees: contributingEmployees,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      
      setRecords(sampleRecords);
      setIsLoading(false);
    };

    setTimeout(initializeData, 500);
  }, []);

  const calculateTotalRemuneration = (record: NewWorkRecord): number => {
    const baseRemuneration = (record.hours_spent * record.hourly_rate) + record.additional_charges;
    return baseRemuneration;
  };

  const calculateProratedRemuneration = (record: NewWorkRecord) => {
    const totalRemuneration = calculateTotalRemuneration(record);
    const totalContributedHours = record.contributing_employees?.reduce((sum, emp) => sum + emp.contributed_hours, 0) || 0;
    const totalHours = record.hours_spent + totalContributedHours;
    
    return {
      mainEmployee: {
        hours: record.hours_spent,
        remuneration: (record.hours_spent / totalHours) * totalRemuneration
      },
      contributors: record.contributing_employees?.map(emp => ({
        ...emp,
        remuneration: (emp.contributed_hours / totalHours) * totalRemuneration
      })) || []
    };
  };

  const addRecord = (newRecord: NewWorkRecord) => {
    const record: WorkRecord = {
      ...newRecord,
      id: Date.now().toString(),
      total_remuneration: calculateTotalRemuneration(newRecord),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setRecords(prev => [record, ...prev]);
    
    const proratedData = calculateProratedRemuneration(newRecord);
    let toastMessage = `Record pekerjaan untuk ${newRecord.employee_name} berhasil ditambahkan!`;
    
    if (newRecord.contributing_employees && newRecord.contributing_employees.length > 0) {
      toastMessage += ` Total remunerasi Rp ${record.total_remuneration.toLocaleString('id-ID')} telah dibagi prorata.`;
    }
    
    toast({
      title: "Record berhasil ditambahkan!",
      description: toastMessage,
    });

    console.log("Prorated Calculation:", proratedData);
  };

  const updateRecord = (id: string, updatedRecord: NewWorkRecord) => {
    setRecords(prev => prev.map(record => 
      record.id === id 
        ? {
            ...record,
            ...updatedRecord,
            total_remuneration: calculateTotalRemuneration(updatedRecord),
            updated_at: new Date().toISOString(),
          }
        : record
    ));
    
    toast({
      title: "Record berhasil diupdate!",
      description: `Data pekerjaan ${updatedRecord.employee_name} telah diperbarui.`,
    });
  };

  const deleteRecord = (id: string) => {
    const record = records.find(r => r.id === id);
    setRecords(prev => prev.filter(record => record.id !== id));
    
    toast({
      title: "Record berhasil dihapus!",
      description: record ? `Record pekerjaan ${record.employee_name} telah dihapus.` : "Record telah dihapus.",
      variant: "destructive",
    });
  };

  const exportToCSV = () => {
    const headers = [
      "Nama Pegawai",
      "Deskripsi Tugas", 
      "Tanggal",
      "Jam Kerja",
      "Tarif per Jam",
      "Biaya Tambahan",
      "Total Remunerasi",
      "Pegawai Kolaborator"
    ];

    const csvData = records.map(record => [
      record.employee_name,
      record.task_description,
      record.date,
      record.hours_spent,
      record.hourly_rate,
      record.additional_charges,
      record.total_remuneration,
      record.contributing_employees?.map(emp => `${emp.employee_name} (${emp.contributed_hours}h)`).join('; ') || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `work-records-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export berhasil!",
      description: "Data record pekerjaan telah didownload dalam format CSV.",
    });
  };

  return {
    records,
    isLoading,
    addRecord,
    updateRecord,
    deleteRecord,
    exportToCSV,
    calculateProratedRemuneration,
  };
};
