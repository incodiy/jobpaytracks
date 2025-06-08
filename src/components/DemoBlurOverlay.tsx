
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Key, AlertTriangle } from 'lucide-react';

interface DemoBlurOverlayProps {
  isActive: boolean;
  onActivateLicense?: () => void;
}

const DemoBlurOverlay: React.FC<DemoBlurOverlayProps> = ({ 
  isActive, 
  onActivateLicense 
}) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/30">
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-sm shadow-xl border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-orange-600" />
            </div>
            
            <h3 className="text-lg font-bold text-orange-900 mb-2">
              Demo Time Expired
            </h3>
            
            <p className="text-orange-700 text-sm mb-4">
              Aktifkan lisensi untuk mengakses tampilan ini dan semua fitur aplikasi.
            </p>
            
            <Button 
              onClick={onActivateLicense}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <Key className="h-4 w-4 mr-2" />
              Activate License
            </Button>
            
            <div className="flex items-center justify-center mt-4">
              <Shield className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-xs text-orange-600">
                Protected Content
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoBlurOverlay;
