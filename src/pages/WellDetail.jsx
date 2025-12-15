import { useParams, useNavigate } from 'react-router-dom';
import { wells, customers } from '../data/dummyData';
import { PageHeader } from '../components';

export default function WellDetail() {
    const { wellId } = useParams();
    const navigate = useNavigate();
    const well = wells.find(w => w.id === Number.parseInt(wellId));

    if (!well) {
        return (
            <div className="p-8">
                <PageHeader title="Sumur Tidak Ditemukan" />
                <button
                    onClick={() => navigate('/wells')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Kembali ke Daftar Sumur
                </button>
            </div>
        );
    }

    // Get customers connected to this well
    const connectedCustomers = customers.filter(c => c.wellId === well.id);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'Inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-8">
            <button
                onClick={() => navigate('/wells')}
                className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
                ← Kembali ke Daftar Sumur
            </button>

            <PageHeader
                title={well.name}
                description={`${ well.city } - ${ well.location }`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Info Card */}
                <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
                        <div className="mb-8">
                            <p className="text-blue-100 text-sm font-medium mb-2">Status Sumur</p>
                            <div className="flex items-center gap-4 mb-4">
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${ getStatusColor(well.status) } bg-opacity-90`}>
                                    {well.status}
                                </span>
                            </div>
                            <p className="text-blue-100 text-sm">{well.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white bg-opacity-10 rounded-lg p-4">
                                <p className="text-blue-100 text-xs font-medium mb-1">Kapasitas Harian</p>
                                <p className="text-2xl font-bold">{well.capacity} m³</p>
                            </div>
                            <div className="bg-white bg-opacity-10 rounded-lg p-4">
                                <p className="text-blue-100 text-xs font-medium mb-1">Produksi Bulanan</p>
                                <p className="text-2xl font-bold">{well.monthlyProduction} m³</p>
                            </div>
                            <div className="bg-white bg-opacity-10 rounded-lg p-4">
                                <p className="text-blue-100 text-xs font-medium mb-1">Pelanggan Terhubung</p>
                                <p className="text-2xl font-bold">{well.connectedCustomers}</p>
                            </div>
                            <div className="bg-white bg-opacity-10 rounded-lg p-4">
                                <p className="text-blue-100 text-xs font-medium mb-1">Tanggal Instalasi</p>
                                <p className="text-lg font-bold">{new Date(well.installationDate).toLocaleDateString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Well Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Sumur</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Nama Sumur</p>
                            <p className="text-sm font-semibold text-gray-800">{well.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Kota</p>
                            <p className="text-sm text-gray-700">{well.city}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Alamat Lengkap</p>
                            <p className="text-sm text-gray-700">{well.location}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${ getStatusColor(well.status) }`}>
                                {well.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connected Customers */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pelanggan Terhubung</h3>
                {connectedCustomers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Telepon</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Kota</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Ukuran Sumur</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {connectedCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                    {customer.name.split(' ')[0][0]}{customer.name.split(' ')[1]?.[0] || ''}
                                                </div>
                                                <span className="font-medium text-gray-800">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{customer.phone}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{customer.city}</td>
                                        <td className="py-3 px-4 text-center text-sm text-gray-700">
                                            <span className="font-medium">{customer.wellSize}</span> m³
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => navigate(`/customers/${ customer.id }`)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Tidak ada pelanggan terhubung ke sumur ini</p>
                    </div>
                )}
            </div>
        </div>
    );
}
