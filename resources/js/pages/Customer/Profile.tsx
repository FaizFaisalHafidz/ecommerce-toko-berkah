import CustomerLayout from '@/components/customer/CustomerLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Camera, User } from 'lucide-react';
import { useState } from 'react';

interface ProfileData {
    name: string;
    nama_lengkap: string;
    email: string;
    telepon?: string;
    tanggal_lahir?: string;
    jenis_kelamin?: string;
    alamat?: string;
    kota?: string;
    provinsi?: string;
    kode_pos?: string;
}

export default function Profile() {
    const { auth } = usePage().props as any;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, put, processing, errors } = useForm<ProfileData>({
        name: auth.user.name || '',
        nama_lengkap: auth.user.nama_lengkap || '',
        email: auth.user.email || '',
        telepon: auth.user.telepon || '',
        tanggal_lahir: auth.user.tanggal_lahir || '',
        jenis_kelamin: auth.user.jenis_kelamin || '',
        alamat: auth.user.alamat || '',
        kota: auth.user.kota || '',
        provinsi: auth.user.provinsi || '',
        kode_pos: auth.user.kode_pos || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile', {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    return (
        <CustomerLayout title="Profile - Toko Tas Berkah">
            <Head title="Profile" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow">
                        {/* Header */}
                        <div className="px-6 py-8 border-b border-gray-200">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {auth.user.nama_lengkap || auth.user.name}
                                    </h1>
                                    <p className="text-gray-600">{auth.user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Informasi Profile</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Pengguna
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_lengkap}
                                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    {errors.nama_lengkap && <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.telepon}
                                        onChange={(e) => setData('telepon', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    {errors.telepon && <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Lahir
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    {errors.tanggal_lahir && <p className="text-red-500 text-sm mt-1">{errors.tanggal_lahir}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        value={data.jenis_kelamin}
                                        onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="laki-laki">Laki-laki</option>
                                        <option value="perempuan">Perempuan</option>
                                        <option value="tidak_disebutkan">Tidak Disebutkan</option>
                                    </select>
                                    {errors.jenis_kelamin && <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alamat
                                    </label>
                                    <textarea
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        disabled={!isEditing}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    {errors.alamat && <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kota
                                    </label>
                                    <input
                                        type="text"
                                        value={data.kota}
                                        onChange={(e) => setData('kota', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    {errors.kota && <p className="text-red-500 text-sm mt-1">{errors.kota}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Provinsi
                                    </label>
                                    <input
                                        type="text"
                                        value={data.provinsi}
                                        onChange={(e) => setData('provinsi', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    {errors.provinsi && <p className="text-red-500 text-sm mt-1">{errors.provinsi}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kode Pos
                                    </label>
                                    <input
                                        type="text"
                                        value={data.kode_pos}
                                        onChange={(e) => setData('kode_pos', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    {errors.kode_pos && <p className="text-red-500 text-sm mt-1">{errors.kode_pos}</p>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
