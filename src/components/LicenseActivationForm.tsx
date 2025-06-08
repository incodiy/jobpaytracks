
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Key, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLicense } from '@/hooks/useLicense';
import { useLicenseConfig } from '@/hooks/useLicenseConfig';

interface LicenseActivationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showDemo?: boolean;
}

const LicenseActivationForm: React.FC<LicenseActivationFormProps> = ({ 
  onSuccess, 
  onCancel,
  showDemo = true 
}) => {
  const { 
    validateLicense, 
    saveLicenseKey,
    isValidating,
    resetDemo 
  } = useLicense();
  
  const { config, formatDuration } = useLicenseConfig();
  
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const handleActivateLicense = async () => {
    if (!licenseKey.trim()) {
      setError('Silakan masukkan kunci lisensi');
      return;
    }

    setError('');
    setIsActivating(true);
    
    try {
      const result = await validateLicense(licenseKey);
      
      if (result.isValid) {
        saveLicenseKey(licenseKey);
        onSuccess?.();
      } else {
        setError(result.error || 'Aktivasi lisensi gagal');
      }
    } catch (err) {
      setError('Gagal memvalidasi lisensi. Silakan coba lagi.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleDemoMode = () => {
    resetDemo();
    saveLicenseKey('DEMO-KEY-12345');
    onSuccess?.();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-red-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900">
            Waktu Demo Habis
          </CardTitle>
          <p className="text-red-700">
            Sesi demo Anda telah berakhir. Silakan aktivasi lisensi untuk melanjutkan menggunakan aplikasi.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="license" className="text-red-900">Kunci Lisensi</Label>
            <Input
              id="license"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="LIC-PEGAWAI-2025-XXXXXX-XXXXXX"
              className="border-red-300 focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleActivateLicense} 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isActivating || isValidating}
            >
              {isActivating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mengaktivasi...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Aktivasi Lisensi
                </>
              )}
            </Button>
            
            {showDemo && config.enableDemo && (
              <Button 
                variant="outline" 
                onClick={handleDemoMode} 
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                disabled={isActivating || isValidating}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Mulai Ulang Demo ({formatDuration(config.demoDuration)})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseActivationForm;
