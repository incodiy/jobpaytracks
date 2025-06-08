
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Key, 
  Clock, 
  Shield, 
  Save,
  RotateCcw,
  Info,
  TestTube
} from 'lucide-react';
import { useLicenseConfig } from '@/hooks/useLicenseConfig';
import { useLicense } from '@/hooks/useLicense';

const LicenseConfigPage: React.FC = () => {
  const { config, updateConfig, resetToDefaults, formatDuration } = useLicenseConfig();
  const { generateLicenseKey, saveLicenseKey } = useLicense();
  const [tempConfig, setTempConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateConfig(tempConfig);
    setIsSaving(false);
  };

  const handleReset = () => {
    resetToDefaults();
    setTempConfig(config);
  };

  const generateDemoKey = () => {
    const demoKey = 'DEMO-KEY-12345';
    setGeneratedKey(demoKey);
  };

  const generateFullKey = () => {
    const fullKey = generateLicenseKey({ 
      name: 'Test User', 
      email: 'test@example.com' 
    });
    setGeneratedKey(fullKey);
  };

  const applyGeneratedKey = () => {
    if (generatedKey) {
      saveLicenseKey(generatedKey);
      setGeneratedKey('');
    }
  };

  const durationOptions = [
    { value: 1800, label: '30 Menit' },
    { value: 3600, label: '1 Jam' },
    { value: 7200, label: '2 Jam' },
    { value: 10800, label: '3 Jam' },
    { value: 21600, label: '6 Jam' },
    { value: 43200, label: '12 Jam' },
    { value: 86400, label: '24 Jam' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Konfigurasi Lisensi</h1>
          <p className="text-gray-600">Kelola pengaturan lisensi dan demo aplikasi</p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Halaman ini hanya dapat diakses oleh administrator. Perubahan akan mempengaruhi 
          seluruh sistem lisensi aplikasi.
        </AlertDescription>
      </Alert>

      {/* Demo Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Konfigurasi Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Aktifkan Mode Demo</Label>
              <p className="text-sm text-gray-500">
                Izinkan pengguna mengakses aplikasi dalam mode demo
              </p>
            </div>
            <Switch
              checked={tempConfig.enableDemo}
              onCheckedChange={(checked) => 
                setTempConfig(prev => ({ ...prev, enableDemo: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Durasi Demo</Label>
            <select
              value={tempConfig.demoDuration}
              onChange={(e) => 
                setTempConfig(prev => ({ ...prev, demoDuration: parseInt(e.target.value) }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {durationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              Durasi saat ini: {formatDuration(tempConfig.demoDuration)}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Maksimal Sesi Demo</Label>
            <Input
              type="number"
              value={tempConfig.maxDemoSessions}
              onChange={(e) => 
                setTempConfig(prev => ({ ...prev, maxDemoSessions: parseInt(e.target.value) || 1 }))
              }
              min={1}
              max={10}
            />
            <p className="text-sm text-gray-500">
              Jumlah maksimal sesi demo yang dapat berjalan bersamaan
            </p>
          </div>
        </CardContent>
      </Card>

      {/* License Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>Generator Lisensi (Developer Tools)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={generateDemoKey} variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Generate Demo Key
            </Button>
            <Button onClick={generateFullKey} variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Generate Full Key
            </Button>
          </div>

          {generatedKey && (
            <div className="space-y-2">
              <Label>Generated License Key:</Label>
              <div className="flex space-x-2">
                <Input value={generatedKey} readOnly />
                <Button onClick={applyGeneratedKey} size="sm">
                  Apply
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Pengaturan Administrator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Admin License Key</Label>
            <Input
              value={tempConfig.adminLicenseKey}
              onChange={(e) => 
                setTempConfig(prev => ({ ...prev, adminLicenseKey: e.target.value }))
              }
              placeholder="DEV-LIFETIME-2025-MAIN-DEVELOPER"
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Info className="h-4 w-4" />
            <span>Terakhir diupdate: {new Date(config.lastUpdated).toLocaleString('id-ID')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset ke Default
        </Button>
        
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Simpan Konfigurasi
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LicenseConfigPage;
