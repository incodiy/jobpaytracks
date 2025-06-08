
export interface LicenseConfig {
  demoDuration: number; // in seconds
  enableDemo: boolean;
  adminLicenseKey: string;
  maxDemoSessions: number;
  demoRestrictedFeatures: string[];
  lastUpdated: string;
}

export interface LicenseSettings {
  config: LicenseConfig;
  updateConfig: (config: Partial<LicenseConfig>) => void;
  resetToDefaults: () => void;
}
