
import { useState, useEffect } from 'react';
import { UserRole } from '@/types/user-management';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ROLES_STORAGE_KEY = 'user_roles';

// Default system roles
const DEFAULT_ROLES: UserRole[] = [
  {
    id: 'admin',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access',
    permissions: ['all'],
    isSystemRole: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'employee',
    name: 'employee',
    displayName: 'Karyawan',
    description: 'Basic employee access',
    permissions: ['records_read', 'records_write'],
    isSystemRole: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'viewer',
    name: 'viewer',
    displayName: 'Viewer',
    description: 'Read-only access',
    permissions: ['records_read', 'reports_read'],
    isSystemRole: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useRoleManagement = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>(DEFAULT_ROLES);
  const [isLoading, setIsLoading] = useState(true);

  // Load roles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(ROLES_STORAGE_KEY);
    if (stored) {
      try {
        const storedRoles = JSON.parse(stored);
        // Merge with default roles to ensure system roles exist
        const mergedRoles = [...DEFAULT_ROLES];
        storedRoles.forEach((role: UserRole) => {
          if (!role.isSystemRole) {
            mergedRoles.push(role);
          }
        });
        setRoles(mergedRoles);
      } catch (error) {
        console.error('Error loading roles:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save roles to localStorage
  const saveRoles = (updatedRoles: UserRole[]) => {
    const customRoles = updatedRoles.filter(role => !role.isSystemRole);
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(customRoles));
    setRoles(updatedRoles);
  };

  // Create new role
  const createRole = (roleData: Omit<UserRole, 'id' | 'created_at' | 'updated_at' | 'isSystemRole'>) => {
    // Only system admin can create roles
    if (!user?.isSystemAdmin) {
      toast({
        title: 'Akses ditolak',
        description: 'Hanya system admin yang dapat membuat role',
        variant: 'destructive',
      });
      return;
    }

    const newRole: UserRole = {
      ...roleData,
      id: `role-${Date.now()}`,
      isSystemRole: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedRoles = [...roles, newRole];
    saveRoles(updatedRoles);

    toast({
      title: 'Role berhasil dibuat!',
      description: `Role ${newRole.displayName} telah ditambahkan`,
    });

    return newRole;
  };

  // Update role
  const updateRole = (roleId: string, updates: Partial<UserRole>) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (role.isSystemRole) {
      toast({
        title: 'Tidak dapat mengubah system role',
        description: 'System role tidak dapat dimodifikasi',
        variant: 'destructive',
      });
      return;
    }

    // Only system admin can update roles
    if (!user?.isSystemAdmin) {
      toast({
        title: 'Akses ditolak',
        description: 'Hanya system admin yang dapat mengubah role',
        variant: 'destructive',
      });
      return;
    }

    const updatedRoles = roles.map(role =>
      role.id === roleId 
        ? { ...role, ...updates, updated_at: new Date().toISOString() }
        : role
    );
    saveRoles(updatedRoles);

    toast({
      title: 'Role berhasil diperbarui',
      description: 'Perubahan telah disimpan',
    });
  };

  // Delete role
  const deleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (role.isSystemRole) {
      toast({
        title: 'Tidak dapat menghapus system role',
        description: 'System role tidak dapat dihapus',
        variant: 'destructive',
      });
      return;
    }

    // Only system admin can delete roles
    if (!user?.isSystemAdmin) {
      toast({
        title: 'Akses ditolak',
        description: 'Hanya system admin yang dapat menghapus role',
        variant: 'destructive',
      });
      return;
    }

    const updatedRoles = roles.filter(role => role.id !== roleId);
    saveRoles(updatedRoles);

    toast({
      title: 'Role berhasil dihapus',
      description: `Role ${role.displayName} telah dihapus`,
    });
  };

  // Get role by name
  const getRoleByName = (roleName: string): UserRole | undefined => {
    return roles.find(role => role.name === roleName);
  };

  // Get custom roles only
  const getCustomRoles = (): UserRole[] => {
    return roles.filter(role => !role.isSystemRole);
  };

  // Get visible roles based on user permissions
  const getVisibleRoles = (): UserRole[] => {
    if (user?.isSystemAdmin) {
      return roles; // System admin sees all roles
    }
    return DEFAULT_ROLES; // Licensed users only see basic roles
  };

  return {
    roles: getVisibleRoles(),
    isLoading,
    createRole,
    updateRole,
    deleteRole,
    getRoleByName,
    getCustomRoles,
  };
};
