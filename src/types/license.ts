
export interface License {
  key: string;
  type: 'demo' | 'full' | 'trial' | 'lifetime';
  features: string[];
  expires_at?: string;
  company_name?: string;
  max_employees?: number;
  max_records?: number;
  created_at: string;
  is_valid: boolean;
  device_id?: string;
  user_id?: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface LicenseValidation {
  isValid: boolean;
  license?: License;
  error?: string;
  isDemoMode: boolean;
  demoTimeLeft?: number; // seconds remaining
  demoExpired?: boolean;
}

export interface EncryptionConfig {
  enabled: boolean;
  key?: string;
  algorithm: 'AES' | 'RSA';
}

export interface DemoCountdown {
  isActive: boolean;
  timeLeft: number; // seconds
  startTime: number; // timestamp
  duration: number; // total demo duration in seconds (1 hour = 3600)
}

export interface LicenseActivationForm {
  licenseKey: string;
  deviceId: string;
  userAgent: string;
}
