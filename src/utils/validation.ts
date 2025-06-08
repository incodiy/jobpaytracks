
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateWorkRecord = (data: {
  employee_name: string;
  task_description: string;
  date: string;
  hours_spent: number;
  hourly_rate: number;
  additional_charges: number;
  contributing_employees?: Array<{
    employee_name: string;
    contributed_hours: number;
  }>;
}): ValidationResult => {
  const errors: string[] = [];

  // Validasi nama pegawai
  if (!data.employee_name || data.employee_name.trim().length === 0) {
    errors.push("Nama pegawai harus diisi");
  }

  // Validasi deskripsi tugas
  if (!data.task_description || data.task_description.trim().length < 10) {
    errors.push("Deskripsi tugas minimal 10 karakter");
  }

  // Validasi tanggal
  const selectedDate = new Date(data.date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (selectedDate > today) {
    errors.push("Tanggal tidak boleh di masa depan");
  }

  // Validasi jam kerja
  if (data.hours_spent <= 0) {
    errors.push("Jam kerja harus lebih dari 0");
  }

  if (data.hours_spent > 24) {
    errors.push("Jam kerja tidak boleh lebih dari 24 jam per hari");
  }

  // Validasi tarif per jam
  if (data.hourly_rate <= 0) {
    errors.push("Tarif per jam harus lebih dari 0");
  }

  if (data.hourly_rate > 10000000) {
    errors.push("Tarif per jam terlalu tinggi (maksimal Rp 10.000.000)");
  }

  // Validasi biaya tambahan
  if (data.additional_charges < 0) {
    errors.push("Biaya tambahan tidak boleh negatif");
  }

  // Validasi contributing employees
  if (data.contributing_employees && data.contributing_employees.length > 0) {
    data.contributing_employees.forEach((contributor, index) => {
      if (!contributor.employee_name || contributor.employee_name.trim().length === 0) {
        errors.push(`Nama pegawai kolaborator ${index + 1} harus diisi`);
      }

      if (contributor.contributed_hours <= 0) {
        errors.push(`Jam kontribusi pegawai ${contributor.employee_name || index + 1} harus lebih dari 0`);
      }

      if (contributor.contributed_hours > 24) {
        errors.push(`Jam kontribusi pegawai ${contributor.employee_name || index + 1} tidak boleh lebih dari 24 jam`);
      }

      // Cek duplikasi pegawai
      const duplicates = data.contributing_employees!.filter(emp => emp.employee_name === contributor.employee_name);
      if (duplicates.length > 1) {
        errors.push(`Pegawai ${contributor.employee_name} tidak boleh diduplikasi`);
      }

      // Cek jika pegawai kolaborator sama dengan pegawai utama
      if (contributor.employee_name === data.employee_name) {
        errors.push(`Pegawai kolaborator tidak boleh sama dengan pegawai utama`);
      }
    });

    // Validasi total jam kerja tidak terlalu berlebihan
    const totalContributedHours = data.contributing_employees.reduce((sum, emp) => sum + emp.contributed_hours, 0);
    const totalHours = data.hours_spent + totalContributedHours;
    
    if (totalHours > 48) {
      errors.push("Total jam kerja keseluruhan terlalu tinggi (maksimal 48 jam untuk satu tugas)");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmployee = (data: {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  hourly_rate: number;
}): ValidationResult => {
  const errors: string[] = [];

  // Validasi nama
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Nama minimal 2 karakter");
  }

  if (data.name.length > 100) {
    errors.push("Nama maksimal 100 karakter");
  }

  // Validasi email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Format email tidak valid");
  }

  // Validasi nomor telepon
  const phoneRegex = /^(\+62|0)[0-9]{9,13}$/;
  if (!data.phone || !phoneRegex.test(data.phone.replace(/[\s-]/g, ''))) {
    errors.push("Format nomor telepon tidak valid (gunakan format Indonesia)");
  }

  // Validasi posisi dan departemen
  if (!data.position || data.position.trim().length === 0) {
    errors.push("Posisi harus diisi");
  }

  if (!data.department || data.department.trim().length === 0) {
    errors.push("Departemen harus diisi");
  }

  // Validasi tanggal bergabung
  const hireDate = new Date(data.hire_date);
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 10);

  if (hireDate > today) {
    errors.push("Tanggal bergabung tidak boleh di masa depan");
  }

  if (hireDate < oneYearAgo) {
    errors.push("Tanggal bergabung tidak boleh lebih dari 10 tahun yang lalu");
  }

  // Validasi tarif per jam
  if (data.hourly_rate <= 0) {
    errors.push("Tarif per jam harus lebih dari 0");
  }

  if (data.hourly_rate > 10000000) {
    errors.push("Tarif per jam terlalu tinggi (maksimal Rp 10.000.000)");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
