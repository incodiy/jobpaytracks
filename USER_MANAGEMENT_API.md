
# User Management API Documentation

## Overview
Dokumentasi API untuk sistem manajemen pengguna dan lisensi pada Employee Work Record System. API ini mengelola pengguna berlisensi, role, dan profile.

## Base URL
```
Production: https://api.workrecord.com/v1
Development: http://localhost:8000/api/v1
```

## Authentication
Semua request API memerlukan autentikasi menggunakan Bearer token:
```
Authorization: Bearer {jwt_token}
```

---

## User Management Endpoints

### GET /users
Mendapatkan daftar pengguna berlisensi dengan pagination dan filtering.

**Query Parameters:**
- `page` (int): Nomor halaman (default: 1)
- `per_page` (int): Item per halaman (default: 15, max: 100)
- `search` (string): Pencarian berdasarkan nama, email, username, role
- `role` (string): Filter berdasarkan role
- `department` (string): Filter berdasarkan department
- `license_status` (string): Filter berdasarkan status lisensi (active|expired|suspended)
- `license_type` (string): Filter berdasarkan tipe lisensi (demo|full|trial)
- `sort_by` (string): Field untuk sorting (fullName|email|created_at|expiryDate)
- `sort_order` (string): Arah sorting (asc|desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-1234567890",
        "username": "johndoe123",
        "email": "john@company.com",
        "fullName": "John Doe",
        "address": "Jl. Contoh No. 123, Jakarta",
        "phoneNumber": "+62 812-3456-7890",
        "rekNumber": "1234567890",
        "bankName": "Bank Mandiri",
        "licenseKey": "LIC-PEGAWAI-2025-ABC123-DEF456",
        "licenseStatus": "active",
        "licenseType": "full",
        "issuedDate": "2024-01-01T00:00:00Z",
        "expiryDate": "2025-01-01T00:00:00Z",
        "lastLoginDate": "2024-01-15T10:30:00Z",
        "activationDate": "2024-01-01T00:00:00Z",
        "generatedBy": "admin",
        "role": "employee",
        "department": "IT",
        "avatar": null,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 50,
    "last_page": 4
  }
}
```

### POST /users
Membuat pengguna berlisensi baru.

**Request Body:**
```json
{
  "username": "johndoe123",
  "email": "john@company.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "address": "Jl. Contoh No. 123, Jakarta",
  "phoneNumber": "+62 812-3456-7890",
  "rekNumber": "1234567890",
  "bankName": "Bank Mandiri",
  "duration": 12,
  "licenseType": "full",
  "role": "employee",
  "department": "IT"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "data": {
    "user": {
      "id": "user-1234567890",
      "username": "johndoe123",
      "email": "john@company.com",
      "fullName": "John Doe",
      "address": "Jl. Contoh No. 123, Jakarta",
      "phoneNumber": "+62 812-3456-7890",
      "rekNumber": "1234567890",
      "bankName": "Bank Mandiri",
      "licenseKey": "LIC-PEGAWAI-2025-ABC123-DEF456",
      "licenseStatus": "active",
      "licenseType": "full",
      "issuedDate": "2024-01-01T00:00:00Z",
      "expiryDate": "2025-01-01T00:00:00Z",
      "generatedBy": "admin",
      "role": "employee",
      "department": "IT",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### GET /users/{id}
Mendapatkan detail pengguna berlisensi.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-1234567890",
      "username": "johndoe123",
      "email": "john@company.com",
      "fullName": "John Doe",
      "address": "Jl. Contoh No. 123, Jakarta",
      "phoneNumber": "+62 812-3456-7890",
      "rekNumber": "1234567890",
      "bankName": "Bank Mandiri",
      "licenseKey": "LIC-PEGAWAI-2025-ABC123-DEF456",
      "licenseStatus": "active",
      "licenseType": "full",
      "issuedDate": "2024-01-01T00:00:00Z",
      "expiryDate": "2025-01-01T00:00:00Z",
      "lastLoginDate": "2024-01-15T10:30:00Z",
      "activationDate": "2024-01-01T00:00:00Z",
      "generatedBy": "admin",
      "role": "employee",
      "department": "IT",
      "avatar": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### PUT /users/{id}
Update pengguna berlisensi.

**Request Body:**
```json
{
  "username": "johndoe123",
  "fullName": "John Doe Updated",
  "address": "Jl. Baru No. 456, Jakarta",
  "phoneNumber": "+62 813-4567-8901",
  "rekNumber": "0987654321",
  "bankName": "Bank BCA",
  "role": "admin",
  "department": "Management",
  "password": "newpassword123" // optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User berhasil diperbarui",
  "data": {
    "user": {
      // Updated user object
    }
  }
}
```

### DELETE /users/{id}
Hapus pengguna berlisensi.

**Response (200):**
```json
{
  "success": true,
  "message": "User berhasil dihapus"
}
```

### PUT /users/{id}/license-status
Toggle status lisensi pengguna (active/suspended).

**Request Body:**
```json
{
  "status": "suspended"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Status lisensi berhasil diperbarui",
  "data": {
    "user": {
      // Updated user object with new license status
    }
  }
}
```

### POST /users/{id}/regenerate-license
Generate ulang license key untuk pengguna.

**Request Body:**
```json
{
  "duration": 12
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "License key berhasil di-generate ulang",
  "data": {
    "user": {
      // Updated user object with new license key
    }
  }
}
```

---

## Role Management Endpoints

### GET /roles
Mendapatkan daftar role (system dan custom).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "admin",
        "name": "admin",
        "displayName": "Administrator",
        "description": "Full system access",
        "permissions": ["all"],
        "department": null,
        "isSystemRole": true,
        "userCount": 5,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "role-1234567890",
        "name": "it_department",
        "displayName": "IT Department",
        "description": "IT team members",
        "permissions": ["records_read", "records_write", "reports_read"],
        "department": "IT",
        "isSystemRole": false,
        "userCount": 10,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /roles
Membuat role custom baru.

**Request Body:**
```json
{
  "name": "marketing_team",
  "displayName": "Marketing Team",
  "description": "Marketing department staff",
  "permissions": ["records_read", "reports_read"],
  "department": "Marketing"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Role berhasil dibuat",
  "data": {
    "role": {
      "id": "role-1234567891",
      "name": "marketing_team",
      "displayName": "Marketing Team",
      "description": "Marketing department staff",
      "permissions": ["records_read", "reports_read"],
      "department": "Marketing",
      "isSystemRole": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### PUT /roles/{id}
Update role custom (tidak bisa update system role).

**Request Body:**
```json
{
  "displayName": "Marketing Team Updated",
  "description": "Updated description",
  "permissions": ["records_read", "reports_read", "dashboard_access"],
  "department": "Marketing & Sales"
}
```

### DELETE /roles/{id}
Hapus role custom (tidak bisa hapus system role).

**Response (200):**
```json
{
  "success": true,
  "message": "Role berhasil dihapus"
}
```

---

## Profile Endpoints

### GET /profile
Mendapatkan profile pengguna yang sedang login.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user-1234567890",
      "username": "johndoe123",
      "email": "john@company.com",
      "fullName": "John Doe",
      "address": "Jl. Contoh No. 123, Jakarta",
      "phoneNumber": "+62 812-3456-7890",
      "rekNumber": "1234567890",
      "bankName": "Bank Mandiri",
      "department": "IT",
      "avatar": null,
      "role": "employee",
      "licenseInfo": {
        "licenseKey": "LIC-PEGAWAI-2025-ABC123-DEF456",
        "licenseStatus": "active",
        "licenseType": "full",
        "expiryDate": "2025-01-01T00:00:00Z",
        "lastLoginDate": "2024-01-15T10:30:00Z"
      }
    }
  }
}
```

### PUT /profile
Update profile pengguna yang sedang login.

**Request Body:**
```json
{
  "username": "johndoe123",
  "fullName": "John Doe Updated",
  "address": "Jl. Baru No. 456, Jakarta",
  "phoneNumber": "+62 813-4567-8901",
  "rekNumber": "0987654321",
  "bankName": "Bank BCA",
  "department": "IT Support"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile berhasil diperbarui",
  "data": {
    "profile": {
      // Updated profile object
    }
  }
}
```

---

## Authentication with Licensed Users

### POST /auth/login
Login menggunakan email dan password dari pengguna berlisensi.

**Request Body:**
```json
{
  "email": "john@company.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "user-1234567890",
      "name": "John Doe",
      "email": "john@company.com",
      "role": "employee",
      "department": "IT",
      "avatar": null,
      "isSystemAdmin": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "token": "jwt_token_here",
    "expires_at": "2024-01-02T00:00:00Z",
    "licenseInfo": {
      "licenseKey": "LIC-PEGAWAI-2025-ABC123-DEF456",
      "licenseStatus": "active",
      "licenseType": "full",
      "expiryDate": "2025-01-01T00:00:00Z"
    }
  }
}
```

---

## Validation Rules

### User Validation
- `username`: required, string, min:3, max:50, unique
- `email`: required, email, unique
- `password`: required (untuk create), string, min:8, max:100
- `fullName`: required, string, min:2, max:100
- `address`: required, string, min:10, max:255
- `phoneNumber`: required, string, regex:/^(\+62|0)[0-9]{9,15}$/
- `rekNumber`: optional, string, max:50
- `bankName`: optional, string, max:100
- `duration`: required, integer, min:1, max:60
- `licenseType`: required, in:demo,full,trial
- `role`: required, exists:roles,name
- `department`: optional, string, max:100

### Role Validation
- `name`: required, string, min:3, max:50, unique, regex:/^[a-z_]+$/
- `displayName`: required, string, min:3, max:100
- `description`: optional, string, max:255
- `permissions`: required, array
- `permissions.*`: required, string
- `department`: optional, string, max:100

### Profile Validation
- `username`: required, string, min:3, max:50, unique (exclude current user)
- `fullName`: required, string, min:2, max:100
- `address`: required, string, min:10, max:255
- `phoneNumber`: required, string, regex:/^(\+62|0)[0-9]{9,15}$/
- `rekNumber`: optional, string, max:50
- `bankName`: optional, string, max:100
- `department`: optional, string, max:100

---

## Error Codes
- `USER_NOT_FOUND`: User tidak ditemukan
- `LICENSE_EXPIRED`: Lisensi telah berakhir
- `LICENSE_SUSPENDED`: Lisensi ditangguhkan
- `INVALID_ROLE`: Role tidak valid
- `CANNOT_MODIFY_SYSTEM_ROLE`: Tidak dapat mengubah system role
- `EMAIL_ALREADY_TAKEN`: Email sudah digunakan
- `USERNAME_ALREADY_TAKEN`: Username sudah digunakan
- `INSUFFICIENT_PERMISSIONS`: Hak akses tidak mencukupi

---

## Integration Notes

### Sinkronisasi dengan Employee Management
- Pengguna dengan role yang memiliki permission untuk mengelola karyawan akan muncul di halaman Employee Management
- Data karyawan akan disinkronkan dengan data pengguna berlisensi
- Perubahan pada data karyawan akan mempengaruhi data pengguna berlisensi

### Role-Based Access Control (RBAC)
- System roles: admin, employee, viewer (tidak dapat dimodifikasi)
- Custom roles: dapat dibuat, dimodifikasi, dan dihapus oleh admin
- Permissions: all, records_read, records_write, reports_read, reports_write, dashboard_access, employee_manage

### License Management Integration
- User management terintegrasi dengan sistem lisensi
- Status lisensi mempengaruhi kemampuan login
- Expired licenses akan otomatis menonaktifkan akses
- License key generation menggunakan format: LIC-PEGAWAI-2025-{random}-{timestamp}
