
# API Specification - Employee Work Record System

## Overview
This document outlines the REST API specification for the Employee Work Record System. All endpoints follow RESTful conventions and return JSON responses.

## Base URL
```
Production: https://api.workrecord.com/v1
Development: http://localhost:8000/api/v1
```

## Authentication
All API requests require authentication using Bearer tokens:
```
Authorization: Bearer {jwt_token}
```

## Standard Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}, // Response data
  "meta": {   // Pagination/metadata (when applicable)
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7
  }
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  },
  "code": "ERROR_CODE"
}
```

---

## Authentication Endpoints

### POST /auth/login
Login user and get access token.

**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@company.com",
      "role": "admin|employee|viewer",
      "department": "IT",
      "avatar": "url_to_avatar",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here",
    "expires_at": "2024-01-02T00:00:00Z"
  }
}
```

### POST /auth/logout
Logout current user and invalidate token.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /auth/me
Get current authenticated user information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@company.com",
      "role": "admin",
      "department": "IT",
      "avatar": "url_to_avatar",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

## Employee Endpoints

### GET /employees
Get paginated list of employees with filtering and searching.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `per_page` (int): Items per page (default: 15, max: 100)
- `search` (string): Search in name, email, position
- `department` (string): Filter by department
- `status` (string): Filter by status (active|inactive)
- `sort_by` (string): Sort field (name|email|hire_date|created_at)
- `sort_order` (string): Sort direction (asc|desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": "uuid",
        "name": "Ahmad Fauzi",
        "email": "ahmad@company.com",
        "phone": "+62 812-3456-7890",
        "position": "Senior Developer",
        "department": "IT",
        "hire_date": "2023-01-15",
        "hourly_rate": 150000,
        "status": "active",
        "avatar": "url_to_avatar",
        "total_hours_worked": 160,
        "total_earnings": 24000000,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  },
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7,
    "from": 1,
    "to": 15
  }
}
```

### GET /employees/{id}
Get specific employee details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "uuid",
      "name": "Ahmad Fauzi",
      "email": "ahmad@company.com",
      "phone": "+62 812-3456-7890",
      "position": "Senior Developer",
      "department": "IT",
      "hire_date": "2023-01-15",
      "hourly_rate": 150000,
      "status": "active",
      "avatar": "url_to_avatar",
      "total_hours_worked": 160,
      "total_earnings": 24000000,
      "work_records_count": 25,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### POST /employees
Create new employee.

**Request Body:**
```json
{
  "name": "Siti Nurhaliza",
  "email": "siti@company.com",
  "phone": "+62 813-4567-8901",
  "position": "UI/UX Designer",
  "department": "Design",
  "hire_date": "2024-01-15",
  "hourly_rate": 120000,
  "status": "active"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "employee": {
      "id": "uuid",
      "name": "Siti Nurhaliza",
      "email": "siti@company.com",
      "phone": "+62 813-4567-8901",
      "position": "UI/UX Designer",
      "department": "Design",
      "hire_date": "2024-01-15",
      "hourly_rate": 120000,
      "status": "active",
      "avatar": null,
      "total_hours_worked": 0,
      "total_earnings": 0,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### PUT /employees/{id}
Update existing employee.

**Request Body:** (Same as POST, all fields optional)

**Response (200):**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "employee": {
      // Updated employee object
    }
  }
}
```

### DELETE /employees/{id}
Delete employee (soft delete recommended).

**Response (200):**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

---

## Work Record Endpoints

### GET /work-records
Get paginated list of work records with filtering.

**Query Parameters:**
- `page` (int): Page number
- `per_page` (int): Items per page
- `search` (string): Search in employee_name, task_description
- `employee_id` (string): Filter by employee
- `date_from` (date): Filter from date (YYYY-MM-DD)
- `date_to` (date): Filter to date (YYYY-MM-DD)
- `sort_by` (string): Sort field
- `sort_order` (string): Sort direction

**Response (200):**
```json
{
  "success": true,
  "data": {
    "work_records": [
      {
        "id": "uuid",
        "employee_id": "uuid",
        "employee_name": "Ahmad Fauzi",
        "task_description": "Development of login feature",
        "date": "2024-01-15",
        "hours_spent": 8.5,
        "hourly_rate": 150000,
        "additional_charges": 50000,
        "total_remuneration": 1325000,
        "contributing_employees": [
          {
            "employee_id": "uuid",
            "employee_name": "Siti Nurhaliza",
            "contributed_hours": 2.5,
            "prorated_remuneration": 331250
          }
        ],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
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

### POST /work-records
Create new work record.

**Request Body:**
```json
{
  "employee_id": "uuid",
  "task_description": "Development of payment gateway integration",
  "date": "2024-01-15",
  "hours_spent": 8.0,
  "hourly_rate": 150000,
  "additional_charges": 25000,
  "contributing_employees": [
    {
      "employee_id": "uuid",
      "contributed_hours": 3.0
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Work record created successfully",
  "data": {
    "work_record": {
      "id": "uuid",
      "employee_id": "uuid",
      "employee_name": "Ahmad Fauzi",
      "task_description": "Development of payment gateway integration",
      "date": "2024-01-15",
      "hours_spent": 8.0,
      "hourly_rate": 150000,
      "additional_charges": 25000,
      "total_remuneration": 1225000,
      "contributing_employees": [
        {
          "employee_id": "uuid",
          "employee_name": "Siti Nurhaliza",
          "contributed_hours": 3.0,
          "prorated_remuneration": 333636
        }
      ],
      "prorated_calculation": {
        "total_hours": 11.0,
        "main_employee": {
          "hours": 8.0,
          "remuneration": 891364
        },
        "contributors": [
          {
            "employee_id": "uuid",
            "employee_name": "Siti Nurhaliza",
            "hours": 3.0,
            "remuneration": 333636
          }
        ]
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### PUT /work-records/{id}
Update existing work record.

**Request Body:** (Same as POST)

### DELETE /work-records/{id}
Delete work record.

---

## Dashboard & Analytics Endpoints

### GET /dashboard/stats
Get dashboard statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_employees": 100,
    "active_employees": 85,
    "total_work_records": 500,
    "total_hours_this_month": 2500,
    "total_earnings_this_month": 375000000,
    "avg_hourly_rate": 125000,
    "top_performers": [
      {
        "employee_id": "uuid",
        "employee_name": "Ahmad Fauzi",
        "total_hours": 160,
        "total_earnings": 24000000
      }
    ]
  }
}
```

### GET /dashboard/recent-records
Get recent work records for dashboard.

**Query Parameters:**
- `limit` (int): Number of records (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recent_records": [
      // Array of work record objects
    ]
  }
}
```

---

## Reports Endpoints

### GET /reports/earnings
Get earnings report with various groupings.

**Query Parameters:**
- `period` (string): monthly|yearly
- `group_by` (string): department|employee|month
- `year` (int): Filter by year
- `month` (int): Filter by month (1-12)
- `department` (string): Filter by department

**Response (200):**
```json
{
  "success": true,
  "data": {
    "report_data": [
      {
        "period": "2024-01",
        "department": "IT",
        "total_hours": 320,
        "total_earnings": 48000000,
        "avg_hourly_rate": 150000,
        "employee_count": 4
      }
    ],
    "summary": {
      "total_earnings": 150000000,
      "total_hours": 1000,
      "avg_hourly_rate": 150000
    }
  }
}
```

### GET /reports/productivity
Get productivity report by employee/department.

### POST /reports/export
Export reports to PDF/Excel.

**Request Body:**
```json
{
  "report_type": "earnings|productivity|hours",
  "format": "pdf|excel",
  "filters": {
    "date_from": "2024-01-01",
    "date_to": "2024-12-31",
    "department": "IT"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "download_url": "https://api.workrecord.com/exports/report_12345.pdf",
    "expires_at": "2024-01-01T23:59:59Z"
  }
}
```

---

## Validation Rules

### Employee Validation
- `name`: required, string, min:2, max:100
- `email`: required, email, unique:employees
- `phone`: required, string, regex:/^(\+62|0)[0-9]{9,13}$/
- `position`: required, string, max:100
- `department`: required, string, in:predefined_departments
- `hire_date`: required, date, before_or_equal:today
- `hourly_rate`: required, numeric, min:1000, max:10000000
- `status`: required, in:active,inactive

### Work Record Validation
- `employee_id`: required, exists:employees,id
- `task_description`: required, string, min:10, max:1000
- `date`: required, date, before_or_equal:today
- `hours_spent`: required, numeric, min:0.5, max:24
- `hourly_rate`: required, numeric, min:1000, max:10000000
- `additional_charges`: optional, numeric, min:0
- `contributing_employees.*.employee_id`: exists:employees,id
- `contributing_employees.*.contributed_hours`: numeric, min:0.5, max:24

---

## Error Codes
- `UNAUTHORIZED`: Invalid or missing authentication
- `FORBIDDEN`: Insufficient permissions
- `VALIDATION_ERROR`: Request validation failed
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ENTRY`: Unique constraint violation
- `SERVER_ERROR`: Internal server error

---

## Rate Limiting
- Authentication endpoints: 5 requests per minute
- CRUD operations: 60 requests per minute
- Reports/exports: 10 requests per minute

---

## Webhooks (Optional)
The system can send webhooks for important events:

- `employee.created`
- `employee.updated`
- `employee.deleted`
- `work_record.created`
- `work_record.updated`
- `work_record.deleted`

Webhook payload format:
```json
{
  "event": "work_record.created",
  "data": {
    // Event data object
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```
