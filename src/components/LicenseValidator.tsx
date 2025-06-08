import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Key, Shield, Settings, Clock } from 'lucide-react';
import { useLicense } from '@/hooks/useLicense';
import { useLicenseConfig } from '@/hooks/useLicenseConfig';
import DemoCountdownTimer from './DemoCountdownTimer';
import LicenseActivationForm from './LicenseActivationForm';
import DraggableDemoTimer from './DraggableDemoTimer';
import LicenseExpiryNotification from './LicenseExpiryNotification';
import { useAuth } from '@/contexts/AuthContext';

interface LicenseValidatorProps {
  children: React.ReactNode;
}

const LicenseValidator: React.FC<LicenseValidatorProps> = ({ children }) => {
  const { user } = useAuth();
  const { 
    license, 
    isValidating, 
    isDemoMode,
    isDemoExpired,
    demoCountdown,
    validateLicense, 
    saveLicenseKey 
  } = useLicense();
  
  const { config, formatDuration } = useLicenseConfig();
  
  const [licenseKey, setLicenseKey] = useState('');
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [error, setError] = useState('');
  const [showExpiryNotification, setShowExpiryNotification] = useState(true);

  // System admin bypasses all license checks
  const isSystemAdmin = user?.isSystemAdmin;

  // Auto-start demo if no license and demo is enabled (except for system admin)
  React.useEffect(() => {
    if (!isSystemAdmin && !license && !isDemoMode && config.enableDemo) {
      handleDemoMode();
    }
  }, [license, isDemoMode, config.enableDemo, isSystemAdmin]);

  // Show license activation form if demo expired (except for system admin)
  if (!isSystemAdmin && isDemoExpired) {
    return (
      <LicenseActivationForm
        onSuccess={() => setShowLicenseForm(false)}
        showDemo={true}
      />
    );
  }

  const handleValidateLicense = async () => {
    setError('');
    const result = await validateLicense(licenseKey);
    
    if (result.isValid) {
      saveLicenseKey(licenseKey);
      setShowLicenseForm(false);
    } else {
      setError(result.error || 'License validation failed');
    }
  };

  const handleDemoMode = () => {
    saveLicenseKey('DEMO-KEY-12345');
    setShowLicenseForm(false);
  };

  if (isValidating && !isSystemAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Validating license...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showLicenseForm && !isSystemAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Aktivasi Lisensi
            </CardTitle>
            <p className="text-gray-600">Masukkan kunci lisensi untuk mengakses aplikasi</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="license">License Key</Label>
              <Input
                id="license"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Masukkan kunci lisensi"
              />
            </div>

            <div className="space-y-2">
              <Button onClick={handleValidateLicense} className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Aktivasi Lisensi
              </Button>
              
              {config.enableDemo && (
                <Button 
                  variant="outline" 
                  onClick={handleDemoMode} 
                  className="w-full"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mulai Mode Demo ({formatDuration(config.demoDuration)})
                </Button>
              )}
            </div>

            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowLicenseForm(false)}
              >
                Kembali ke Aplikasi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate days remaining for license expiry (for non-system admin users)
  const calculateDaysRemaining = (): number => {
    if (!license || !license.expires_at) return -1;
    const now = new Date();
    const expiryDate = new Date(license.expires_at);
    const diffTime = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining();
  const shouldShowExpiryWarning = !isSystemAdmin && license && daysRemaining > 0 && daysRemaining <= 90;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Draggable Demo Countdown Timer - only for non-system admin users */}
      {!isSystemAdmin && isDemoMode && demoCountdown.isActive && (
        <DraggableDemoTimer
          timeLeft={demoCountdown.timeLeft}
          isVisible={true}
          onExpired={() => {
            console.log('Demo expired!');
          }}
        />
      )}

      {/* License Expiry Notification - only for non-system admin users */}
      {shouldShowExpiryWarning && showExpiryNotification && (
        <LicenseExpiryNotification
          daysRemaining={daysRemaining}
          isVisible={true}
          onClose={() => setShowExpiryNotification(false)}
        />
      )}

      {/* License Status Bar - only for non-system admin users */}
      {!isSystemAdmin && license && (
        <div className="bg-white border-b px-6 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge 
                variant={isDemoMode ? "secondary" : license.type === 'lifetime' ? "default" : "default"}
                className="flex items-center space-x-1"
              >
                <Shield className="h-3 w-3" />
                <span>{license.type.toUpperCase()} License</span>
              </Badge>
              
              {license.company_name && (
                <span className="text-sm text-gray-600">{license.company_name}</span>
              )}
              
              {isDemoMode && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-orange-600">
                    Demo Mode - {Math.ceil(demoCountdown.timeLeft / 60)} menit tersisa
                  </span>
                </div>
              )}

              {license.type === 'lifetime' && (
                <span className="text-xs text-green-600 font-medium">
                  Developer License - Unlimited Access
                </span>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowLicenseForm(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* System Admin Status Bar */}
      {isSystemAdmin && (
        <div className="bg-red-600 text-white px-6 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="font-semibold">System Administrator - Full Access</span>
            </div>
            <span className="text-xs">adverslined@gmail.com</span>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default LicenseValidator;
