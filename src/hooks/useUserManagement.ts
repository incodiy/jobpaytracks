
import { useState, useEffect } from 'react';
import { LicensedUser, LicenseRequest } from '@/types/user-management';
import { User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const USERS_STORAGE_KEY = 'licensed_users';

export const useUserManagement = () => {
  const { user } = useAuth();
  const [licensedUsers, setLicensedUsers] = useState<LicensedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load users from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      try {
        setLicensedUsers(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading licensed users:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save users to localStorage
  const saveUsers = (users: LicensedUser[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    setLicensedUsers(users);
  };

  // Generate license key
  const generateLicenseKey = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `LIC-PEGAWAI-2025-${randomPart}-${timestamp}`;
  };

  // Create new licensed user
  const createLicensedUser = (request: LicenseRequest): LicensedUser => {
    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + request.duration);

    const newUser: LicensedUser = {
      id: `user-${Date.now()}`,
      username: request.username,
      email: request.email,
      password: request.password,
      fullName: request.fullName,
      address: request.address,
      phoneNumber: request.phoneNumber,
      rekNumber: request.rekNumber,
      bankName: request.bankName,
      licenseKey: generateLicenseKey(),
      licenseStatus: 'active',
      licenseType: request.licenseType,
      issuedDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      generatedBy: user?.isSystemAdmin ? 'admin' : user?.id || 'admin',
      role: request.role,
      department: request.department,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const updatedUsers = [...licensedUsers, newUser];
    saveUsers(updatedUsers);

    toast({
      title: 'User berhasil dibuat!',
      description: `User ${newUser.fullName} dengan role ${newUser.role} telah diaktifkan`,
    });

    return newUser;
  };

  // Update user
  const updateUser = (userId: string, updates: Partial<LicensedUser>) => {
    const updatedUsers = licensedUsers.map(user =>
      user.id === userId 
        ? { ...user, ...updates, updated_at: new Date().toISOString() } 
        : user
    );
    saveUsers(updatedUsers);

    toast({
      title: 'User berhasil diperbarui',
      description: 'Perubahan telah disimpan',
    });
  };

  // Delete user
  const deleteUser = (userId: string) => {
    const updatedUsers = licensedUsers.filter(user => user.id !== userId);
    saveUsers(updatedUsers);

    toast({
      title: 'User berhasil dihapus',
      description: 'User telah dihapus dari sistem',
    });
  };

  // Update user license status
  const updateUserLicense = (userId: string, updates: Partial<LicensedUser>) => {
    updateUser(userId, updates);
  };

  // Toggle license status
  const toggleLicenseStatus = (userId: string) => {
    const userToToggle = licensedUsers.find(u => u.id === userId);
    if (!userToToggle) return;

    const newStatus = userToToggle.licenseStatus === 'active' ? 'suspended' : 'active';
    updateUser(userId, { licenseStatus: newStatus });
  };

  // Generate new license for existing user
  const regenerateLicense = (userId: string, duration: number) => {
    const userToRegenerate = licensedUsers.find(u => u.id === userId);
    if (!userToRegenerate) return;

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + duration);

    updateUser(userId, {
      licenseKey: generateLicenseKey(),
      licenseStatus: 'active',
      issuedDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
    });
  };

  // Convert LicensedUser to Auth User format for login
  const convertToAuthUser = (licensedUser: LicensedUser): User => {
    return {
      id: licensedUser.id,
      name: licensedUser.fullName,
      email: licensedUser.email,
      role: licensedUser.role as 'admin' | 'employee' | 'viewer',
      department: licensedUser.department,
      avatar: licensedUser.avatar,
      isSystemAdmin: false,
      created_at: licensedUser.created_at,
      updated_at: licensedUser.updated_at,
    };
  };

  // Authenticate user for login
  const authenticateUser = (email: string, password: string): User | null => {
    const foundUser = licensedUsers.find(u => 
      u.email === email && 
      u.password === password && 
      u.licenseStatus === 'active'
    );
    
    if (foundUser) {
      // Update last login
      updateUser(foundUser.id, { 
        lastLoginDate: new Date().toISOString() 
      });
      
      return convertToAuthUser(foundUser);
    }
    
    return null;
  };

  // Get visible users based on current user's permissions
  const getVisibleUsers = (): LicensedUser[] => {
    if (user?.isSystemAdmin) {
      return licensedUsers; // System admin sees all licensed users
    }
    
    // Licensed users can only see users they manage (not implemented yet)
    return [];
  };

  // Check expiring licenses
  const getExpiringLicenses = (daysThreshold: number = 90): LicensedUser[] => {
    const now = new Date();
    const threshold = new Date(now);
    threshold.setDate(threshold.getDate() + daysThreshold);
    
    const visibleUsers = getVisibleUsers();
    return visibleUsers.filter(user => {
      const expiryDate = new Date(user.expiryDate);
      return user.licenseStatus === 'active' && expiryDate <= threshold && expiryDate > now;
    });
  };

  // Check expired licenses
  const getExpiredLicenses = (): LicensedUser[] => {
    const now = new Date();
    const visibleUsers = getVisibleUsers();
    return visibleUsers.filter(user => {
      const expiryDate = new Date(user.expiryDate);
      return expiryDate < now && user.licenseStatus !== 'expired';
    });
  };

  // Get users by role
  const getUsersByRole = (role: string): LicensedUser[] => {
    const visibleUsers = getVisibleUsers();
    return visibleUsers.filter(user => user.role === role);
  };

  // Send email notification (mock)
  const sendEmailNotification = async (email: string, type: string, message: string) => {
    console.log('📧 Email Notification:', { email, type, message });
    return Promise.resolve();
  };

  return {
    licensedUsers: getVisibleUsers(),
    isLoading,
    createLicensedUser,
    updateUser,
    deleteUser,
    updateUserLicense,
    toggleLicenseStatus,
    regenerateLicense,
    authenticateUser,
    convertToAuthUser,
    getExpiringLicenses,
    getExpiredLicenses,
    getUsersByRole,
    sendEmailNotification,
  };
};
