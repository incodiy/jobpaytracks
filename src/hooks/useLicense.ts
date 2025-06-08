
import { useState, useEffect } from 'react';
import { License, LicenseValidation } from '@/types/license';
import { toast } from '@/hooks/use-toast';
import { useDemoCountdown } from './useDemoCountdown';

// Developer lifetime license (hardcoded for main developer)
const DEVELOPER_LICENSE_KEY = import.meta.env.VITE_DEVELOPER_LICENSE_KEY || 'DEV-LIFETIME-2025-MAIN-DEVELOPER';

export const useLicense = () => {
  const [license, setLicense] = useState<License | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { countdown, isExpired, startDemo, stopDemo, resetDemo } = useDemoCountdown();

  // Generate device ID for license binding
  const generateDeviceId = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 2, 2);
    const canvasFingerprint = canvas.toDataURL();
    
    const deviceInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvasFingerprint.slice(-50),
    };
    
    return btoa(JSON.stringify(deviceInfo)).slice(0, 32);
  };

  // Demo license untuk testing
  const demoLicense: License = {
    key: 'DEMO-KEY-12345',
    type: 'demo',
    features: ['basic_crud', 'reports', 'dashboard'],
    company_name: 'Demo Company',
    max_employees: 10,
    max_records: 50,
    created_at: new Date().toISOString(),
    is_valid: true,
    status: 'active',
  };

  // Developer lifetime license
  const developerLicense: License = {
    key: DEVELOPER_LICENSE_KEY,
    type: 'lifetime',
    features: ['unlimited'],
    company_name: 'Developer License',
    max_employees: -1,
    max_records: -1,
    created_at: new Date().toISOString(),
    is_valid: true,
    status: 'active',
  };

  // Validate license with backend API
  const validateLicense = async (licenseKey: string): Promise<LicenseValidation> => {
    console.log('🔑 API Call: POST /api/v1/license/validate', { license_key: licenseKey });
    
    setIsValidating(true);
    
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check developer lifetime license
    if (licenseKey === DEVELOPER_LICENSE_KEY) {
      setLicense(developerLicense);
      setIsDemoMode(false);
      stopDemo();
      setIsValidating(false);
      
      return {
        isValid: true,
        license: developerLicense,
        isDemoMode: false,
      };
    }

    // Check demo license
    if (licenseKey === 'DEMO-KEY-12345') {
      setLicense(demoLicense);
      setIsDemoMode(true);
      
      // Start demo countdown if not already started
      if (!countdown.isActive && !isExpired) {
        startDemo();
      }
      
      setIsValidating(false);
      
      return {
        isValid: true,
        license: demoLicense,
        isDemoMode: true,
        demoTimeLeft: countdown.timeLeft,
        demoExpired: isExpired,
      };
    }

    // Check full license format: LIC-PEGAWAI-2025-[randomhash]-[hash_validasi]
    if (licenseKey.startsWith('LIC-PEGAWAI-2025-')) {
      const deviceId = generateDeviceId();
      
      // Simulate backend validation
      const fullLicense: License = {
        key: licenseKey,
        type: 'full',
        features: ['unlimited'],
        company_name: 'Licensed Company',
        max_employees: -1,
        max_records: -1,
        created_at: new Date().toISOString(),
        is_valid: true,
        device_id: deviceId,
        status: 'active',
      };
      
      setLicense(fullLicense);
      setIsDemoMode(false);
      stopDemo();
      setIsValidating(false);
      
      return {
        isValid: true,
        license: fullLicense,
        isDemoMode: false,
      };
    }

    setIsValidating(false);
    return {
      isValid: false,
      error: 'Invalid license key',
      isDemoMode: false,
    };
  };

  // Generate license key (untuk backend Laravel)
  const generateLicenseKey = (userData: { name: string; email: string; expiredDate?: string }): string => {
    const randomHash = Math.random().toString(36).substring(2, 15).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    const userHash = btoa(userData.name + userData.email).slice(0, 8).toUpperCase();
    return `LIC-PEGAWAI-2025-${randomHash}-${userHash}${timestamp}`;
  };

  // Check stored license on app start
  useEffect(() => {
    const storedLicense = localStorage.getItem('app_license_key');
    if (storedLicense) {
      validateLicense(storedLicense);
    } else {
      // Try developer license first, then demo
      if (DEVELOPER_LICENSE_KEY && DEVELOPER_LICENSE_KEY !== 'DEV-LIFETIME-2025-MAIN-DEVELOPER') {
        validateLicense(DEVELOPER_LICENSE_KEY);
      } else {
        validateLicense('DEMO-KEY-12345');
      }
    }
  }, []);

  const saveLicenseKey = (key: string) => {
    localStorage.setItem('app_license_key', key);
    validateLicense(key);
  };

  const clearLicense = () => {
    localStorage.removeItem('app_license_key');
    setLicense(null);
    setIsDemoMode(false);
    stopDemo();
  };

  const hasFeature = (feature: string): boolean => {
    if (!license) return false;
    return license.features.includes(feature) || license.features.includes('unlimited');
  };

  const canAddEmployees = (): boolean => {
    if (!license) return false;
    if (license.max_employees === -1) return true;
    return true;
  };

  const canAddRecords = (): boolean => {
    if (!license) return false;
    if (license.max_records === -1) return true;
    return true;
  };

  const isDemoExpired = isDemoMode && isExpired;

  return {
    license,
    isValidating,
    isDemoMode,
    isDemoExpired,
    demoCountdown: countdown,
    validateLicense,
    generateLicenseKey,
    saveLicenseKey,
    clearLicense,
    hasFeature,
    canAddEmployees,
    canAddRecords,
    resetDemo, // for testing
  };
};
