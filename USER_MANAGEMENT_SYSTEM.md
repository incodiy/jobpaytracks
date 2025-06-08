
# User Management System Documentation

## Overview
Sistem manajemen pengguna yang terintegrasi dengan sistem lisensi untuk aplikasi pencatatan pekerjaan pegawai.

## Features

### 1. Authentication & Authorization
- **System Admin**: Akun utama administrator sistem (`adverslined@gmail.com`)
- **Licensed Users**: Pengguna dengan lisensi aktif yang otomatis menjadi admin perusahaan
- **Demo Users**: Akun demo untuk testing (admin@company.com, ahmad@company.com, viewer@company.com)

### 2. User Management
- Create, Read, Update, Delete licensed users
- License management (activate, suspend, regenerate)
- Role assignment and management
- Profile management for users

### 3. Role Management
- System roles: admin, employee, viewer
- Custom roles (hanya system admin)
- Role-based access control
- Department-based grouping

### 4. Data Synchronization
- Employee list synchronized with licensed users
- Real-time data updates
- Scoped data access based on user permissions

### 5. UI Features
- Table view with pagination (10 items per page)
- Card view with load more functionality
- Search functionality on all dropdowns/selects
- Responsive design

## User Types & Permissions

### System Administrator
- **Email**: adverslined@gmail.com
- **Password**: @adminAdversLined
- **Permissions**:
  - View all licensed users
  - Manage all roles (create, update, delete)
  - Access license configuration
  - Full system access

### Licensed User (Company Admin)
- **Permissions**:
  - Manage their company's employees
  - View only their company's data
  - Cannot see other companies' data
  - Limited role management

### Demo Users
- **Admin Demo**: admin@company.com / password
- **Employee Demo**: ahmad@company.com / password
- **Viewer Demo**: viewer@company.com / password

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### User Management
```
GET    /api/users              # Get all licensed users (scoped)
POST   /api/users              # Create new licensed user
PUT    /api/users/{id}         # Update user
DELETE /api/users/{id}         # Delete user
POST   /api/users/{id}/toggle  # Toggle license status
POST   /api/users/{id}/regenerate # Regenerate license
```

### Role Management
```
GET    /api/roles              # Get roles (scoped)
POST   /api/roles              # Create role (system admin only)
PUT    /api/roles/{id}         # Update role (system admin only)
DELETE /api/roles/{id}         # Delete role (system admin only)
```

### Employee Management
```
GET    /api/employees          # Get employees (scoped to user's company)
POST   /api/employees          # Create employee
PUT    /api/employees/{id}     # Update employee
DELETE /api/employees/{id}     # Delete employee
```

## Database Schema

### licensed_users
```sql
CREATE TABLE licensed_users (
    id VARCHAR PRIMARY KEY,
    username VARCHAR UNIQUE,
    email VARCHAR UNIQUE,
    password VARCHAR,
    full_name VARCHAR,
    address TEXT,
    phone_number VARCHAR,
    rek_number VARCHAR,
    bank_name VARCHAR,
    license_key VARCHAR UNIQUE,
    license_status ENUM('active', 'expired', 'suspended'),
    license_type ENUM('demo', 'full', 'trial'),
    issued_date TIMESTAMP,
    expiry_date TIMESTAMP,
    last_login_date TIMESTAMP,
    activation_date TIMESTAMP,
    generated_by VARCHAR,
    role VARCHAR,
    department VARCHAR,
    avatar VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### user_roles
```sql
CREATE TABLE user_roles (
    id VARCHAR PRIMARY KEY,
    name VARCHAR UNIQUE,
    display_name VARCHAR,
    description TEXT,
    permissions JSON,
    department VARCHAR,
    is_system_role BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### employees
```sql
CREATE TABLE employees (
    id VARCHAR PRIMARY KEY,
    company_id VARCHAR, -- References licensed_users.id
    name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    position VARCHAR,
    department VARCHAR,
    hire_date DATE,
    hourly_rate DECIMAL,
    status ENUM('active', 'inactive'),
    total_hours_worked DECIMAL DEFAULT 0,
    total_earnings DECIMAL DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Frontend Components

### Core Components
- `UserManagementPage`: Main user management interface
- `UserForm`: Create/edit user form
- `UserTableView`: Table and card view for users
- `UserProfilePage`: User profile management
- `PaginatedTable`: Reusable paginated table component
- `LoadMoreCards`: Load more functionality for card views

### Hooks
- `useUserManagement`: User CRUD operations
- `useRoleManagement`: Role management with scoping
- `useAuth`: Authentication and authorization

## Usage Examples

### Creating a Licensed User
```typescript
const { createLicensedUser } = useUserManagement();

const newUser = await createLicensedUser({
    username: 'budi_santoso',
    email: 'budi@perusahaan.com',
    password: 'password',
    fullName: 'Budi Santoso',
    address: 'Jl. Sudirman No. 123',
    phoneNumber: '081234567890',
    duration: 12, // months
    licenseType: 'full',
    role: 'admin',
    department: 'Management'
});
```

### Authentication
```typescript
const { login } = useAuth();

// System admin login
await login({
    email: 'adverslined@gmail.com',
    password: '@adminAdversLined'
});

// Licensed user login
await login({
    email: 'budi@perusahaan.com',
    password: 'password'
});
```

### Role Management
```typescript
const { createRole, roles } = useRoleManagement();

// Only system admin can create roles
const newRole = createRole({
    name: 'manager',
    displayName: 'Manager',
    description: 'Department manager role',
    permissions: ['records_read', 'records_write', 'reports_read'],
    department: 'Operations'
});
```

## Security Considerations

1. **Password Hashing**: Passwords should be hashed before storage
2. **JWT Tokens**: Implement proper JWT token validation
3. **CORS**: Configure CORS for production
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Input Validation**: Validate all input data
6. **SQL Injection**: Use parameterized queries

## Deployment

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=employee_management
DB_USER=root
DB_PASS=password
JWT_SECRET=your-secret-key
APP_ENV=production
```

### Laravel Configuration
1. Configure database connection
2. Run migrations
3. Set up JWT authentication
4. Configure middleware for role-based access
5. Set up CORS for frontend

## Testing

### Test Users
System provides dummy data for testing:
- Budi Santoso (budi@perusahaan.com)
- Sari Dewi (sari@tokobuku.com)
- Ahmad Rizki (ahmad@konstruksi.co.id)

All test users use password: `password`

## Support

For technical support or questions, contact the development team.
