
export interface LicensedUser {
  id: string;
  username: string;
  email: string;
  password?: string; // Optional for existing users
  fullName: string;
  address: string;
  phoneNumber: string;
  rekNumber?: string;
  bankName?: string;
  licenseKey: string;
  licenseStatus: 'active' | 'expired' | 'suspended';
  licenseType: 'demo' | 'full' | 'trial';
  issuedDate: string;
  expiryDate: string;
  lastLoginDate?: string;
  activationDate?: string;
  generatedBy: string;
  role: string; // Custom role
  department?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface LicenseRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  rekNumber?: string;
  bankName?: string;
  duration: number; // in months
  licenseType: 'demo' | 'full' | 'trial';
  role: string;
  department?: string;
}

export interface UserRole {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  department?: string;
  isSystemRole: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserLicenseNotification {
  userId: string;
  type: 'expiring_soon' | 'expired' | 'activated';
  message: string;
  sentDate: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string; // readonly
  fullName: string;
  address: string;
  phoneNumber: string;
  rekNumber?: string;
  bankName?: string;
  department?: string;
  avatar?: string;
}
