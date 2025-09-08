<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat roles terlebih dahulu
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);

        // Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@tokotasberkah.com'],
            [
                'name' => 'Administrator',
                'nama_lengkap' => 'Administrator',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'nomor_telepon' => '081234567890',
                'tanggal_lahir' => '1985-01-15',
                'jenis_kelamin' => 'laki-laki',
                'alamat' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'kota' => 'Jakarta',
                'provinsi' => 'DKI Jakarta',
                'kode_pos' => '10220',
            ]
        );
        $admin->assignRole($adminRole);
        if (!$admin->hasRole($adminRole)) {
            $admin->assignRole($adminRole);
        }

                        // Customer Users
        $customers = [
            [
                'name' => 'Siti Nurhaliza',
                'nama_lengkap' => 'Siti Nurhaliza',
                'email' => 'siti@email.com',
                'password' => Hash::make('password123'),
                'nomor_telepon' => '081234567891',
                'tanggal_lahir' => '1992-03-20',
                'jenis_kelamin' => 'perempuan',
                'alamat' => 'Jl. Merdeka No. 45, Bandung',
                'kota' => 'Bandung',
                'provinsi' => 'Jawa Barat',
                'kode_pos' => '40115',
            ],
            [
                'name' => 'Ahmad Rizky',
                'nama_lengkap' => 'Ahmad Rizky',
                'email' => 'ahmad@email.com',
                'password' => Hash::make('password123'),
                'nomor_telepon' => '081234567892',
                'tanggal_lahir' => '1988-07-10',
                'jenis_kelamin' => 'laki-laki',
                'alamat' => 'Jl. Malioboro No. 67, Yogyakarta',
                'kota' => 'Yogyakarta',
                'provinsi' => 'DI Yogyakarta',
                'kode_pos' => '55271',
            ],
            [
                'name' => 'Dewi Lestari',
                'nama_lengkap' => 'Dewi Lestari',
                'email' => 'dewi@email.com',
                'password' => Hash::make('password123'),
                'nomor_telepon' => '081234567893',
                'tanggal_lahir' => '1995-11-25',
                'jenis_kelamin' => 'perempuan',
                'alamat' => 'Jl. Diponegoro No. 89, Surabaya',
                'kota' => 'Surabaya',
                'provinsi' => 'Jawa Timur',
                'kode_pos' => '60241',
            ],
            [
                'name' => 'Budi Santoso',
                'nama_lengkap' => 'Budi Santoso',
                'email' => 'budi@email.com',
                'password' => Hash::make('password123'),
                'nomor_telepon' => '081234567894',
                'tanggal_lahir' => '1990-05-08',
                'jenis_kelamin' => 'laki-laki',
                'alamat' => 'Jl. Ahmad Yani No. 12, Medan',
                'kota' => 'Medan',
                'provinsi' => 'Sumatera Utara',
                'kode_pos' => '20234',
            ],
        ];

        foreach ($customers as $customerData) {
            $customerData['email_verified_at'] = now();
            $customer = User::firstOrCreate(
                ['email' => $customerData['email']],
                $customerData
            );
            if (!$customer->hasRole($customerRole)) {
                $customer->assignRole($customerRole);
            }
        }
    }
}
