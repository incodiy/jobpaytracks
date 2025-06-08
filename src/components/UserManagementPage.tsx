
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Plus, 
  Search, 
  Shield,
  UserCog,
  Settings
} from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useRoleManagement } from '@/hooks/useRoleManagement';
import { LicenseRequest, LicensedUser } from '@/types/user-management';
import UserTableView from './UserTableView';
import UserForm from './UserForm';
import ViewToggle from './ViewToggle';

const UserManagementPage: React.FC = () => {
  const { 
    licensedUsers, 
    isLoading, 
    createLicensedUser, 
    updateUser,
    deleteUser,
    toggleLicenseStatus,
    regenerateLicense 
  } = useUserManagement();

  const { roles } = useRoleManagement();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<LicensedUser | null>(null);
  const [view, setView] = useState<'table' | 'card'>('card');
  const [showRoleManagement, setShowRoleManagement] = useState(false);

  const handleCreateUser = (formData: LicenseRequest) => {
    createLicensedUser(formData);
    setShowCreateForm(false);
  };

  const handleEditUser = (user: LicensedUser) => {
    setEditingUser(user);
    setShowCreateForm(true);
  };

  const handleUpdateUser = (formData: LicenseRequest) => {
    if (!editingUser) return;
    
    updateUser(editingUser.id, {
      username: formData.username,
      fullName: formData.fullName,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      rekNumber: formData.rekNumber,
      bankName: formData.bankName,
      role: formData.role,
      department: formData.department,
      licenseType: formData.licenseType,
      ...(formData.password && { password: formData.password }),
    });
    
    setEditingUser(null);
    setShowCreateForm(false);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingUser(null);
  };

  const handleViewDetails = (userId: string) => {
    setSelectedUser(selectedUser === userId ? null : userId);
  };

  const filteredUsers = licensedUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-8">Memuat data pengguna...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
            <p className="text-gray-600">Kelola pengguna dan lisensi aplikasi</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowRoleManagement(!showRoleManagement)}>
            <UserCog className="h-4 w-4 mr-2" />
            Kelola Role
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pengguna</p>
                <p className="text-2xl font-bold">{licensedUsers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lisensi Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {licensedUsers.filter(u => u.licenseStatus === 'active').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Role</p>
                <p className="text-2xl font-bold text-purple-600">{roles.length}</p>
              </div>
              <UserCog className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custom Role</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {roles.filter(r => !r.isSystemRole).length}
                </p>
              </div>
              <Settings className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Management Panel */}
      {showRoleManagement && (
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <div key={role.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{role.displayName}</h4>
                    <Badge variant={role.isSystemRole ? "default" : "secondary"}>
                      {role.isSystemRole ? "System" : "Custom"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                  <p className="text-xs text-gray-500">
                    Users: {licensedUsers.filter(u => u.role === role.name).length}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari pengguna berdasarkan nama, email, username, atau role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit User Form */}
      {showCreateForm && (
        <UserForm
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={handleCancelForm}
          initialData={editingUser || undefined}
          isEditing={!!editingUser}
        />
      )}

      {/* View Toggle */}
      <ViewToggle
        view={view}
        onViewChange={setView}
        showForm={showCreateForm}
        onToggleForm={() => setShowCreateForm(!showCreateForm)}
        formTitle="Form User"
      />

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <UserTableView
          users={filteredUsers}
          view={view}
          onEdit={handleEditUser}
          onDelete={deleteUser}
          onToggleStatus={toggleLicenseStatus}
          onRegenerate={(userId) => regenerateLicense(userId, 12)}
          onViewDetails={handleViewDetails}
          selectedUser={selectedUser}
        />
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada pengguna'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Coba kata kunci yang berbeda' : 'Tambah pengguna pertama untuk memulai'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagementPage;
