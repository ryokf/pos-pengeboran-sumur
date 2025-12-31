import { useState } from 'react';

export default function AddCustomerModal({
    isOpen,
    onClose,
    onSubmit,
    submitting = false
}) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        rt: '',
        rw: '',
        meter_number: '',
        status: 'active'
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name.trim()) {
            setError('Nama pelanggan wajib diisi');
            return;
        }

        onSubmit(formData);
    };

    const handleClose = () => {
        // Reset form
        setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            rt: '',
            rw: '',
            meter_number: '',
            status: 'active'
        });
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                    <h3 className="text-xl font-semibold text-gray-800">👤 Tambah Pelanggan Baru</h3>
                    <p className="text-sm text-gray-600 mt-1">Masukkan informasi pelanggan baru</p>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Personal Information Section */}
                    <div className="mb-6">
                        <h4 className="text-base font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                            Informasi Pribadi
                        </h4>

                        <div className="space-y-4">
                            {/* Name - Required */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="mb-6">
                        <h4 className="text-base font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                            Informasi Alamat
                        </h4>

                        <div className="space-y-4">
                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                    disabled={submitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="Jalan, nomor rumah, dll"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kota/Kabupaten
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        placeholder="Nama kota"
                                    />
                                </div>

                                {/* RT */}
                                <div>
                                    <label htmlFor="rt" className="block text-sm font-medium text-gray-700 mb-2">
                                        RT
                                    </label>
                                    <input
                                        type="text"
                                        id="rt"
                                        name="rt"
                                        value={formData.rt}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        placeholder="001"
                                    />
                                </div>

                                {/* RW */}
                                <div>
                                    <label htmlFor="rw" className="block text-sm font-medium text-gray-700 mb-2">
                                        RW
                                    </label>
                                    <input
                                        type="text"
                                        id="rw"
                                        name="rw"
                                        value={formData.rw}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        placeholder="001"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meter Information Section */}
                    <div className="mb-6">
                        <h4 className="text-base font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                            Informasi Meteran
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Meter Number */}
                            <div>
                                <label htmlFor="meter_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Meteran
                                </label>
                                <input
                                    type="text"
                                    id="meter_number"
                                    name="meter_number"
                                    value={formData.meter_number}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="Nomor meteran air"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Tidak Aktif</option>
                                    <option value="suspended">Ditangguhkan</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                            <strong>Catatan:</strong> Setelah pelanggan ditambahkan, Anda dapat menambahkan pembacaan meteran dan melakukan transaksi pada halaman detail pelanggan.
                        </p>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan Pelanggan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
