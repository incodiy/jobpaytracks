
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Home, 
  BookOpen,
  Settings,
  Shield,
  UserCog,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLicense } from "@/hooks/useLicense";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { user } = useAuth();
  const { license, isDemoMode } = useLicense();

  const isAdmin = user?.role === 'admin';
  const isSystemAdmin = user?.isSystemAdmin;
  const isEmployee = user?.role === 'employee';
  const isViewer = user?.role === 'viewer';

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      roles: ['admin', 'employee', 'viewer'],
    },
    {
      id: "records",
      label: "Work Records",
      icon: FileText,
      roles: ['admin', 'employee'],
    },
    {
      id: "employees",
      label: "Pegawai",
      icon: Users,
      roles: ['admin'],
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      roles: ['admin', 'viewer'],
    },
    {
      id: "documents",
      label: "Dokumentasi",
      icon: BookOpen,
      roles: ['admin', 'employee', 'viewer'],
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      roles: ['admin', 'employee', 'viewer'],
    },
  ];

  // Add user management for system admin
  if (isSystemAdmin) {
    navItems.splice(-2, 0, {
      id: "user-management",
      label: "Manajemen User",
      icon: UserCog,
      roles: ['admin'],
    });
  }

  // Add license config for admin with lifetime license or system admin
  if ((isAdmin && license?.type === 'lifetime') || isSystemAdmin) {
    navItems.splice(-2, 0, {
      id: "license-config",
      label: "Konfigurasi Lisensi",
      icon: Shield,
      roles: ['admin'],
    });
  }

  const visibleItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="bg-white shadow-sm border-b mb-8">
      <div className="container mx-auto px-6">
        <nav className="flex space-x-1 overflow-x-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 whitespace-nowrap px-4 py-2 ${
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.id === "dashboard" && isDemoMode && !isSystemAdmin && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Demo
                  </Badge>
                )}
                {item.id === "license-config" && (
                  <Settings className="h-3 w-3 ml-1" />
                )}
                {isSystemAdmin && item.id === "user-management" && (
                  <Badge variant="default" className="ml-2 text-xs bg-red-600">
                    Admin
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
