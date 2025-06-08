
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Shield, 
  Eye,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { LicensedUser } from '@/types/user-management';

interface UserTableViewProps {
  users: LicensedUser[];
  view: 'table' | 'card';
  onEdit: (user: LicensedUser) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
  onRegenerate: (userId: string) => void;
  onViewDetails: (userId: string) => void;
  selectedUser: string | null;
}

const UserTableView: React.FC<UserTableViewProps> = ({
  users,
  view,
  onEdit,
  onDelete,
  onToggleStatus,
  onRegenerate,
  onViewDetails,
  selectedUser,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (view === 'table') {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role & Department</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expired Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{user.username}</TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {user.role}
                      </Badge>
                      {user.department && (
                        <p className="text-sm text-gray-500">{user.department}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="secondary" className="mb-1">
                        {user.licenseType}
                      </Badge>
                      <p className="text-xs text-gray-500 font-mono">{user.licenseKey.slice(0, 20)}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.licenseStatus)}>
                      {user.licenseStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(user.expiryDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(user.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRegenerate(user.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStatus(user.id)}
                        className={user.licenseStatus === 'active' ? 'text-orange-600' : 'text-green-600'}
                      >
                        {user.licenseStatus === 'active' ? <Trash2 className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  // Card view
  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(user.licenseStatus)}>
                      {user.licenseStatus}
                    </Badge>
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                    <Badge variant="secondary">
                      {user.licenseType}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{user.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Expired: {formatDate(user.expiryDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-mono text-xs">{user.licenseKey.slice(0, 25)}...</span>
                  </div>
                </div>
                
                {user.address && (
                  <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{user.address}</span>
                  </div>
                )}

                {(user.bankName || user.rekNumber) && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Informasi Bank</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      {user.bankName && <span>Bank: {user.bankName}</span>}
                      {user.rekNumber && <span>Rekening: {user.rekNumber}</span>}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(user.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRegenerate(user.id)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(user.id)}
                  className={user.licenseStatus === 'active' ? 'text-orange-600' : 'text-green-600'}
                >
                  {user.licenseStatus === 'active' ? <Trash2 className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {selectedUser === user.id && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600"><strong>Dibuat:</strong> {formatDate(user.created_at)}</p>
                    <p className="text-gray-600"><strong>Diupdate:</strong> {formatDate(user.updated_at)}</p>
                  </div>
                  <div>
                    {user.lastLoginDate && (
                      <p className="text-gray-600"><strong>Login Terakhir:</strong> {formatDate(user.lastLoginDate)}</p>
                    )}
                    <p className="text-gray-600"><strong>Dibuat oleh:</strong> {user.generatedBy}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserTableView;
