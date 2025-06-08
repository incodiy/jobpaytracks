
# Laravel Backend Implementation Guide - User Management

## Overview
Panduan implementasi backend Laravel untuk sistem manajemen pengguna dan lisensi pada Employee Work Record System.

## Database Schema

### Migration: users_licensed
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users_licensed', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('full_name');
            $table->text('address');
            $table->string('phone_number');
            $table->string('rek_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('license_key')->unique();
            $table->enum('license_status', ['active', 'expired', 'suspended'])->default('active');
            $table->enum('license_type', ['demo', 'full', 'trial'])->default('full');
            $table->timestamp('issued_date');
            $table->timestamp('expiry_date');
            $table->timestamp('last_login_date')->nullable();
            $table->timestamp('activation_date')->nullable();
            $table->string('generated_by');
            $table->string('role');
            $table->string('department')->nullable();
            $table->string('avatar')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            $table->index(['email', 'license_status']);
            $table->index(['role', 'department']);
            $table->index(['license_status', 'expiry_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('users_licensed');
    }
};
```

### Migration: user_roles
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->json('permissions');
            $table->string('department')->nullable();
            $table->boolean('is_system_role')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_roles');
    }
};
```

### Seeder: SystemRolesSeeder
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SystemRolesSeeder extends Seeder
{
    public function run()
    {
        $systemRoles = [
            [
                'id' => Str::uuid(),
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Full system access',
                'permissions' => json_encode(['all']),
                'is_system_role' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'employee',
                'display_name' => 'Karyawan',
                'description' => 'Basic employee access',
                'permissions' => json_encode(['records_read', 'records_write']),
                'is_system_role' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'viewer',
                'display_name' => 'Viewer',
                'description' => 'Read-only access',
                'permissions' => json_encode(['records_read', 'reports_read']),
                'is_system_role' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('user_roles')->insert($systemRoles);
    }
}
```

## Models

### LicensedUser Model
```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class LicensedUser extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $table = 'users_licensed';

    protected $fillable = [
        'username',
        'email',
        'password',
        'full_name',
        'address',
        'phone_number',
        'rek_number',
        'bank_name',
        'license_key',
        'license_status',
        'license_type',
        'issued_date',
        'expiry_date',
        'last_login_date',
        'activation_date',
        'generated_by',
        'role',
        'department',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'issued_date' => 'datetime',
        'expiry_date' => 'datetime',
        'last_login_date' => 'datetime',
        'activation_date' => 'datetime',
        'password' => 'hashed',
    ];

    public function userRole()
    {
        return $this->belongsTo(UserRole::class, 'role', 'name');
    }

    public function isActive()
    {
        return $this->license_status === 'active' && $this->expiry_date > now();
    }

    public function isExpired()
    {
        return $this->expiry_date <= now();
    }

    public function isExpiringSoon($days = 30)
    {
        return $this->expiry_date <= now()->addDays($days) && !$this->isExpired();
    }

    public function generateLicenseKey()
    {
        $timestamp = strtoupper(base_convert(time(), 10, 36));
        $randomPart = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8));
        $userHash = strtoupper(substr(base64_encode($this->full_name . $this->email), 0, 8));
        
        return "LIC-PEGAWAI-2025-{$randomPart}-{$userHash}{$timestamp}";
    }

    public function regenerateLicense($duration = 12)
    {
        $this->license_key = $this->generateLicenseKey();
        $this->license_status = 'active';
        $this->issued_date = now();
        $this->expiry_date = now()->addMonths($duration);
        $this->save();
    }

    public function scopeActive($query)
    {
        return $query->where('license_status', 'active')
                    ->where('expiry_date', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<=', now());
    }

    public function scopeExpiringSoon($query, $days = 30)
    {
        return $query->where('license_status', 'active')
                    ->where('expiry_date', '<=', now()->addDays($days))
                    ->where('expiry_date', '>', now());
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }
}
```

### UserRole Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserRole extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'permissions',
        'department',
        'is_system_role',
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_system_role' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(LicensedUser::class, 'role', 'name');
    }

    public function hasPermission($permission)
    {
        return in_array('all', $this->permissions) || in_array($permission, $this->permissions);
    }

    public function scopeCustom($query)
    {
        return $query->where('is_system_role', false);
    }

    public function scopeSystem($query)
    {
        return $query->where('is_system_role', true);
    }
}
```

## Controllers

### UserManagementController
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LicensedUser;
use App\Models\UserRole;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = LicensedUser::with('userRole');

        // Search
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($request->has('role')) {
            $query->where('role', $request->get('role'));
        }

        if ($request->has('department')) {
            $query->where('department', $request->get('department'));
        }

        if ($request->has('license_status')) {
            $query->where('license_status', $request->get('license_status'));
        }

        if ($request->has('license_type')) {
            $query->where('license_type', $request->get('license_type'));
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $users->items(),
            ],
            'meta' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ],
        ]);
    }

    public function store(CreateUserRequest $request)
    {
        $data = $request->validated();
        
        // Generate license key and dates
        $issuedDate = now();
        $expiryDate = now()->addMonths($data['duration']);
        
        $user = new LicensedUser();
        $user->fill($data);
        $user->password = Hash::make($data['password']);
        $user->license_key = $user->generateLicenseKey();
        $user->license_status = 'active';
        $user->issued_date = $issuedDate;
        $user->expiry_date = $expiryDate;
        $user->generated_by = auth()->user()->full_name ?? 'admin';
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dibuat',
            'data' => [
                'user' => $user->load('userRole'),
            ],
        ], 201);
    }

    public function show(LicensedUser $user)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->load('userRole'),
            ],
        ]);
    }

    public function update(UpdateUserRequest $request, LicensedUser $user)
    {
        $data = $request->validated();
        
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diperbarui',
            'data' => [
                'user' => $user->load('userRole'),
            ],
        ]);
    }

    public function destroy(LicensedUser $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus',
        ]);
    }

    public function toggleLicenseStatus(Request $request, LicensedUser $user)
    {
        $request->validate([
            'status' => 'required|in:active,suspended',
        ]);

        $user->update([
            'license_status' => $request->get('status'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status lisensi berhasil diperbarui',
            'data' => [
                'user' => $user->load('userRole'),
            ],
        ]);
    }

    public function regenerateLicense(Request $request, LicensedUser $user)
    {
        $request->validate([
            'duration' => 'required|integer|min:1|max:60',
        ]);

        $user->regenerateLicense($request->get('duration'));

        return response()->json([
            'success' => true,
            'message' => 'License key berhasil di-generate ulang',
            'data' => [
                'user' => $user->load('userRole'),
            ],
        ]);
    }

    public function statistics()
    {
        $totalUsers = LicensedUser::count();
        $activeUsers = LicensedUser::active()->count();
        $expiredUsers = LicensedUser::expired()->count();
        $expiringSoonUsers = LicensedUser::expiringSoon(30)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'expired_users' => $expiredUsers,
                'expiring_soon_users' => $expiringSoonUsers,
            ],
        ]);
    }
}
```

### RoleManagementController
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserRole;
use App\Models\LicensedUser;
use App\Http\Requests\CreateRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\Request;

class RoleManagementController extends Controller
{
    public function index()
    {
        $roles = UserRole::withCount('users')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'roles' => $roles,
            ],
        ]);
    }

    public function store(CreateRoleRequest $request)
    {
        $role = UserRole::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Role berhasil dibuat',
            'data' => [
                'role' => $role,
            ],
        ], 201);
    }

    public function show(UserRole $role)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'role' => $role->loadCount('users'),
            ],
        ]);
    }

    public function update(UpdateRoleRequest $request, UserRole $role)
    {
        if ($role->is_system_role) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat mengubah system role',
                'code' => 'CANNOT_MODIFY_SYSTEM_ROLE',
            ], 403);
        }

        $role->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Role berhasil diperbarui',
            'data' => [
                'role' => $role,
            ],
        ]);
    }

    public function destroy(UserRole $role)
    {
        if ($role->is_system_role) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus system role',
                'code' => 'CANNOT_MODIFY_SYSTEM_ROLE',
            ], 403);
        }

        if ($role->users()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus role yang masih digunakan',
                'code' => 'ROLE_IN_USE',
            ], 422);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role berhasil dihapus',
        ]);
    }
}
```

### ProfileController
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('userRole');

        return response()->json([
            'success' => true,
            'data' => [
                'profile' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'full_name' => $user->full_name,
                    'address' => $user->address,
                    'phone_number' => $user->phone_number,
                    'rek_number' => $user->rek_number,
                    'bank_name' => $user->bank_name,
                    'department' => $user->department,
                    'avatar' => $user->avatar,
                    'role' => $user->role,
                    'license_info' => [
                        'license_key' => $user->license_key,
                        'license_status' => $user->license_status,
                        'license_type' => $user->license_type,
                        'expiry_date' => $user->expiry_date,
                        'last_login_date' => $user->last_login_date,
                    ],
                ],
            ],
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        
        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Profile berhasil diperbarui',
            'data' => [
                'profile' => $user->fresh()->load('userRole'),
            ],
        ]);
    }
}
```

## Request Validators

### CreateUserRequest
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'username' => 'required|string|min:3|max:50|unique:users_licensed,username',
            'email' => 'required|email|unique:users_licensed,email',
            'password' => 'required|string|min:8|max:100',
            'full_name' => 'required|string|min:2|max:100',
            'address' => 'required|string|min:10|max:255',
            'phone_number' => 'required|string|regex:/^(\+62|0)[0-9]{9,15}$/',
            'rek_number' => 'nullable|string|max:50',
            'bank_name' => 'nullable|string|max:100',
            'duration' => 'required|integer|min:1|max:60',
            'license_type' => 'required|in:demo,full,trial',
            'role' => 'required|exists:user_roles,name',
            'department' => 'nullable|string|max:100',
        ];
    }

    public function messages()
    {
        return [
            'username.unique' => 'Username sudah digunakan',
            'email.unique' => 'Email sudah digunakan',
            'phone_number.regex' => 'Format nomor HP tidak valid',
            'role.exists' => 'Role tidak valid',
        ];
    }
}
```

## Routes
```php
// routes/api.php

Route::middleware(['auth:sanctum'])->group(function () {
    // User Management
    Route::apiResource('users', UserManagementController::class);
    Route::put('users/{user}/license-status', [UserManagementController::class, 'toggleLicenseStatus']);
    Route::post('users/{user}/regenerate-license', [UserManagementController::class, 'regenerateLicense']);
    Route::get('users-statistics', [UserManagementController::class, 'statistics']);

    // Role Management
    Route::apiResource('roles', RoleManagementController::class);

    // Profile
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
});
```

## Authentication Guard
```php
// config/auth.php

'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'sanctum',
        'provider' => 'licensed_users',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],
    'licensed_users' => [
        'driver' => 'eloquent',
        'model' => App\Models\LicensedUser::class,
    ],
],
```

## Console Commands

### ExpireLicensesCommand
```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\LicensedUser;

class ExpireLicensesCommand extends Command
{
    protected $signature = 'licenses:expire';
    protected $description = 'Mark expired licenses as expired';

    public function handle()
    {
        $expiredUsers = LicensedUser::where('license_status', 'active')
            ->where('expiry_date', '<=', now())
            ->get();

        foreach ($expiredUsers as $user) {
            $user->update(['license_status' => 'expired']);
            $this->info("Expired license for user: {$user->email}");
        }

        $this->info("Processed {$expiredUsers->count()} expired licenses");
    }
}
```

## Middleware

### CheckLicenseStatus
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckLicenseStatus
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && !$user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'License expired or suspended',
                'code' => 'LICENSE_EXPIRED',
            ], 403);
        }

        return $next($request);
    }
}
```

## Deployment Notes
1. Jalankan migrasi: `php artisan migrate`
2. Jalankan seeder: `php artisan db:seed --class=SystemRolesSeeder`
3. Setup scheduler untuk otomatis expire license: `php artisan schedule:work`
4. Setup queue worker untuk email notifications
5. Configure file storage untuk avatar uploads
