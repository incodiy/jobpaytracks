
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LicenseRequest, LicensedUser } from '@/types/user-management';
import { useRoleManagement } from '@/hooks/useRoleManagement';

interface UserFormProps {
  onSubmit: (data: LicenseRequest) => void;
  onCancel: () => void;
  initialData?: Partial<LicensedUser>;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}) => {
  const { roles } = useRoleManagement();
  const [formData, setFormData] = useState<LicenseRequest>({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    fullName: initialData?.fullName || '',
    address: initialData?.address || '',
    phoneNumber: initialData?.phoneNumber || '',
    rekNumber: initialData?.rekNumber || '',
    bankName: initialData?.bankName || '',
    duration: 12,
    licenseType: initialData?.licenseType || 'full',
    role: initialData?.role || 'employee',
    department: initialData?.department || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof LicenseRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit User' : 'Tambah User Baru'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="username123"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="user@example.com"
                required
                disabled={isEditing} // Email tidak bisa diubah saat edit
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {!isEditing && '*'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder={isEditing ? "Kosongkan jika tidak ingin mengubah" : "Password user"}
                required={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Nomor HP *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Pilih Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.displayName} {role.isSystemRole && '(System)'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="IT, HR, Finance, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Durasi Lisensi (Bulan)</Label>
              <select
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={6}>6 Bulan</option>
                <option value={12}>1 Tahun</option>
                <option value={24}>2 Tahun</option>
                <option value={36}>3 Tahun</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseType">Tipe Lisensi</Label>
              <select
                value={formData.licenseType}
                onChange={(e) => handleChange('licenseType', e.target.value as 'demo' | 'full' | 'trial')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="full">Full License</option>
                <option value="trial">Trial</option>
                <option value="demo">Demo</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankName">Nama Bank</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="Bank Mandiri, BCA, BNI, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rekNumber">Nomor Rekening</Label>
              <Input
                id="rekNumber"
                value={formData.rekNumber}
                onChange={(e) => handleChange('rekNumber', e.target.value)}
                placeholder="1234567890"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Jl. Contoh No. 123, Jakarta"
              required
            />
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="submit">
              {isEditing ? 'Update User' : 'Buat User'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
