
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, AuthContextType } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo + real admin account
const MOCK_USERS = [
  {
    id: 'admin-001',
    name: 'Administrator',
    email: 'adverslined@gmail.com',
    role: 'admin' as const,
    department: 'System',
    isSystemAdmin: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin' as const,
    department: 'IT',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ahmad Fauzi',
    email: 'ahmad@company.com',
    role: 'employee' as const,
    department: 'IT',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Viewer User',
    email: 'viewer@company.com',
    role: 'viewer' as const,
    department: 'HR',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initialize dummy licensed users data
const initializeDummyData = () => {
  const existingData = localStorage.getItem('licensed_users');
  if (!existingData) {
    const dummyLicensedUsers = [
      {
        id: 'licensed-001',
        username: 'budi_santoso',
        email: 'budi@perusahaan.com',
        password: 'password',
        fullName: 'Budi Santoso',
        address: 'Jl. Sudirman No. 123, Jakarta',
        phoneNumber: '081234567890',
        rekNumber: '1234567890',
        bankName: 'Bank Mandiri',
        licenseKey: 'LIC-PEGAWAI-2025-ABC123-XYZ789',
        licenseStatus: 'active',
        licenseType: 'full',
        issuedDate: new Date('2024-01-15').toISOString(),
        expiryDate: new Date('2025-01-15').toISOString(),
        lastLoginDate: new Date('2024-12-20').toISOString(),
        activationDate: new Date('2024-01-15').toISOString(),
        generatedBy: 'admin',
        role: 'admin',
        department: 'Management',
        avatar: null,
        created_at: new Date('2024-01-15').toISOString(),
        updated_at: new Date('2024-12-20').toISOString(),
      },
      {
        id: 'licensed-002',
        username: 'sari_dewi',
        email: 'sari@tokobuku.com',
        password: 'password',
        fullName: 'Sari Dewi',
        address: 'Jl. Malioboro No. 45, Yogyakarta',
        phoneNumber: '087654321098',
        rekNumber: '9876543210',
        bankName: 'Bank BCA',
        licenseKey: 'LIC-PEGAWAI-2025-DEF456-UVW012',
        licenseStatus: 'active',
        licenseType: 'full',
        issuedDate: new Date('2024-02-10').toISOString(),
        expiryDate: new Date('2025-02-10').toISOString(),
        lastLoginDate: new Date('2024-12-19').toISOString(),
        activationDate: new Date('2024-02-10').toISOString(),
        generatedBy: 'admin',
        role: 'admin',
        department: 'Retail',
        avatar: null,
        created_at: new Date('2024-02-10').toISOString(),
        updated_at: new Date('2024-12-19').toISOString(),
      },
      {
        id: 'licensed-003',
        username: 'ahmad_rizki',
        email: 'ahmad@konstruksi.co.id',
        password: 'password',
        fullName: 'Ahmad Rizki',
        address: 'Jl. Gatot Subroto No. 78, Bandung',
        phoneNumber: '085432109876',
        rekNumber: '5555666677',
        bankName: 'Bank BNI',
        licenseKey: 'LIC-PEGAWAI-2025-GHI789-RST345',
        licenseStatus: 'active',
        licenseType: 'trial',
        issuedDate: new Date('2024-11-01').toISOString(),
        expiryDate: new Date('2025-02-01').toISOString(),
        lastLoginDate: new Date('2024-12-18').toISOString(),
        activationDate: new Date('2024-11-01').toISOString(),
        generatedBy: 'admin',
        role: 'admin',
        department: 'Construction',
        avatar: null,
        created_at: new Date('2024-11-01').toISOString(),
        updated_at: new Date('2024-12-18').toISOString(),
      }
    ];
    
    localStorage.setItem('licensed_users', JSON.stringify(dummyLicensedUsers));
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData();
    
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    console.log('🔗 API Call: POST /api/auth/login', credentials);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for system admin account
      if (credentials.email === 'adverslined@gmail.com' && credentials.password === '@adminAdversLined') {
        const adminUser = MOCK_USERS.find(u => u.email === 'adverslined@gmail.com');
        if (adminUser) {
          const token = 'admin-jwt-token-' + Date.now();
          
          localStorage.setItem('user', JSON.stringify(adminUser));
          localStorage.setItem('token', token);
          setUser(adminUser);
          
          toast({
            title: 'Selamat datang Administrator!',
            description: 'Akses penuh sistem aktif',
          });
          setIsLoading(false);
          return;
        }
      }

      // Check licensed users from localStorage
      const stored = localStorage.getItem('licensed_users');
      if (stored) {
        try {
          const licensedUsers = JSON.parse(stored);
          const licensedUser = licensedUsers.find((u: any) => 
            u.email === credentials.email && 
            u.password === credentials.password && 
            u.licenseStatus === 'active'
          );
          
          if (licensedUser) {
            const authUser: User = {
              id: licensedUser.id,
              name: licensedUser.fullName,
              email: licensedUser.email,
              role: licensedUser.role as 'admin' | 'employee' | 'viewer',
              department: licensedUser.department,
              avatar: licensedUser.avatar,
              isSystemAdmin: false, // Licensed users are not system admins
              created_at: licensedUser.created_at,
              updated_at: licensedUser.updated_at,
            };

            const token = 'licensed-jwt-token-' + Date.now();
            
            localStorage.setItem('user', JSON.stringify(authUser));
            localStorage.setItem('token', token);
            setUser(authUser);
            
            // Update last login date
            const updatedUsers = licensedUsers.map((u: any) =>
              u.id === licensedUser.id 
                ? { ...u, lastLoginDate: new Date().toISOString() }
                : u
            );
            localStorage.setItem('licensed_users', JSON.stringify(updatedUsers));
            
            toast({
              title: 'Login berhasil!',
              description: `Selamat datang, ${authUser.name}`,
            });
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error checking licensed users:', error);
        }
      }
      
      // Fallback to mock authentication for demo users
      const foundUser = MOCK_USERS.find(u => u.email === credentials.email);
      if (!foundUser || credentials.password !== 'password') {
        throw new Error('Invalid credentials');
      }

      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('user', JSON.stringify(foundUser));
      localStorage.setItem('token', token);
      setUser(foundUser);
      
      toast({
        title: 'Login berhasil!',
        description: `Selamat datang, ${foundUser.name}`,
      });
    } catch (error) {
      toast({
        title: 'Login gagal!',
        description: 'Email atau password salah',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🔗 API Call: POST /api/auth/logout');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: 'Logout berhasil',
      description: 'Anda telah keluar dari sistem',
    });
  };

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
