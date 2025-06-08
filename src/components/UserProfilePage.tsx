
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  CreditCard, 
  Save,
  Shield,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserManagement } from '@/hooks/useUserManagement';
import { LicensedUser, UserProfile } from '@/types/user-management';
import { toast } from '@/hooks/use-toast';

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { licensedUsers, updateUser } = useUserManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<LicensedUser | null>(null);

  useEffect(() => {
    if (user) {
      // Find current user in licensed users
      const licensedUser = licensedUsers.find(u => u.email === user.email);
      if (licensedUser) {
        setCurrentUser(licensedUser);
        setProfileData({
          id: licensedUser.id,
          username: licensedUser.username,
          email: licensedUser.email,
          fullName: licensedUser.fullName,
          address: licensedUser.address,
          phoneNumber: licensedUser.phoneNumber,
          rekNumber: licensedUser.rekNumber,
          bankName: licensedUser.bankName,
          department: licensedUser.department,
          avatar: licensedUser.avatar,
        });
      }
    }
  }, [user, licensedUsers]);

  const handleSave = () => {
    if (!profileData || !currentUser) return;

    updateUser(currentUser.id, {
      username: profileData.username,
      fullName: profileData.fullName,
      address: profileData.address,
      phoneNumber: profileData.phoneNumber,
      rekNumber: profileData.rekNumber,
      bankName: profileData.bankName,
      department: profileData.department,
    });

    setIsEditing(false);
    toast({
      title: 'Profile berhasil diperbarui!',
      description: 'Perubahan telah disimpan',
    });
  };

  const handleCancel = () => {
    if (currentUser) {
      setProfileData({
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        fullName: currentUser.fullName,
        address: currentUser.address,
        phoneNumber: currentUser.phoneNumber,
        rekNumber: currentUser.rekNumber,
        bankName: currentUser.bankName,
        department: currentUser.department,
        avatar: currentUser.avatar,
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user || !profileData || !currentUser) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert>
          <AlertDescription>
            Data profile tidak ditemukan. Pastikan Anda login dengan akun yang terdaftar dalam sistem.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Saya</h1>
            <p className="text-gray-600">Kelola informasi personal Anda</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Batal
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">
                {profileData.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
              <p className="text-gray-600">@{profileData.username}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{currentUser.role}</Badge>
                {profileData.department && (
                  <Badge variant="secondary">{profileData.department}</Badge>
                )}
                <Badge className={
                  currentUser.licenseStatus === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }>
                  {currentUser.licenseStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Informasi Lisensi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">License Key</Label>
              <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                {currentUser.licenseKey}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Tipe Lisensi</Label>
              <p className="text-sm">{currentUser.licenseType.toUpperCase()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Tanggal Expired</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{formatDate(currentUser.expiryDate)}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Login Terakhir</Label>
              <p className="text-sm">
                {currentUser.lastLoginDate 
                  ? formatDate(currentUser.lastLoginDate)
                  : 'Belum pernah login'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              {isEditing ? (
                <Input
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => prev ? {...prev, username: e.target.value} : null)}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{profileData.username}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Email (Tidak dapat diubah)</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{profileData.email}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              {isEditing ? (
                <Input
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => prev ? {...prev, fullName: e.target.value} : null)}
                />
              ) : (
                <span>{profileData.fullName}</span>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Nomor HP</Label>
              {isEditing ? (
                <Input
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData(prev => prev ? {...prev, phoneNumber: e.target.value} : null)}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{profileData.phoneNumber}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Department</Label>
              {isEditing ? (
                <Input
                  value={profileData.department || ''}
                  onChange={(e) => setProfileData(prev => prev ? {...prev, department: e.target.value} : null)}
                  placeholder="IT, HR, Finance, etc."
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span>{profileData.department || 'Tidak diset'}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Alamat</Label>
            {isEditing ? (
              <Input
                value={profileData.address}
                onChange={(e) => setProfileData(prev => prev ? {...prev, address: e.target.value} : null)}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{profileData.address}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bank Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Informasi Bank</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Bank</Label>
              {isEditing ? (
                <Input
                  value={profileData.bankName || ''}
                  onChange={(e) => setProfileData(prev => prev ? {...prev, bankName: e.target.value} : null)}
                  placeholder="Bank Mandiri, BCA, BNI, etc."
                />
              ) : (
                <span>{profileData.bankName || 'Tidak diset'}</span>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Nomor Rekening</Label>
              {isEditing ? (
                <Input
                  value={profileData.rekNumber || ''}
                  onChange={(e) => setProfileData(prev => prev ? {...prev, rekNumber: e.target.value} : null)}
                  placeholder="1234567890"
                />
              ) : (
                <span className="font-mono">{profileData.rekNumber || 'Tidak diset'}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
