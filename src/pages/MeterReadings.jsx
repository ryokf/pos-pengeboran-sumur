import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customers, wells, meterReadings } from '../data/dummyData';
import { PageHeader, FilterBar, MeterReadingModal } from '../components';
import {
    getLatestMeterReading,
    getPreviousMeterReading,
    calculateUsage,
    formatDate,
    matchesSearch
} from '../utils';

export default function MeterReadings() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filter customers based on search
    const filteredCustomers = customers.filter(customer =>
        matchesSearch(searchTerm, customer.name, customer.phone, customer.email)
    );

    // Get well name by ID
    const getWellName = (wellId) => {
        const well = wells.find(w => w.id === wellId);
        return well ? well.name : 'N/A';
    };

    // Handle opening modal for a customer
    const handleRecordReading = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    // Handle submitting new reading
    const handleSubmitReading = (newReading) => {
        console.log('New reading submitted:', newReading);
        alert(`Pencatatan meteran untuk ${ selectedCustomer.name } berhasil disimpan!`);
        setShowModal(false);
        setSelectedCustomer(null);
        // In a real app, this would update the state/database
    };

    return (
        <div className="p-8">
            <PageHeader
                title="Pencatatan Meteran"
                description="Kelola pencatatan meteran air pelanggan"
            />

            <FilterBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Cari pelanggan..."
            />

            {/* Meter Readings Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Pelanggan</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Sumur</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Pencatatan Sebelumnya</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Pencatatan Terakhir</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Penggunaan</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => {
                                const latestReading = getLatestMeterReading(customer.id, meterReadings);
                                const previousReading = latestReading
                                    ? getPreviousMeterReading(customer.id, meterReadings, latestReading.readingDate)
                                    : null;
                                const usage = calculateUsage(latestReading, previousReading);

                                return (
                                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-medium text-gray-800">{customer.name}</p>
                                                <p className="text-sm text-gray-600">{customer.phone}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-700">
                                            {getWellName(customer.wellId)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {previousReading ? (
                                                <div>
                                                    <p className="text-sm text-gray-600">{formatDate(previousReading.readingDate)}</p>
                                                    <p className="font-semibold text-gray-800">{previousReading.meterValue} m³</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {latestReading ? (
                                                <div>
                                                    <p className="text-sm text-gray-600">{formatDate(latestReading.readingDate)}</p>
                                                    <p className="font-semibold text-blue-600">{latestReading.meterValue} m³</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">Belum ada data</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {usage > 0 ? (
                                                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                                    <span className="font-bold">{usage.toFixed(1)} m³</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleRecordReading(customer)}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors mr-2"
                                            >
                                                📊 Catat Baru
                                            </button>
                                            <button
                                                onClick={() => navigate(`/customers/${ customer.id }`)}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredCustomers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md mt-6">
                    <p className="text-gray-500">Tidak ada pelanggan ditemukan</p>
                </div>
            )}

            {/* Meter Reading Modal */}
            {selectedCustomer && (
                <MeterReadingModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedCustomer(null);
                    }}
                    customerId={selectedCustomer.id}
                    customerName={selectedCustomer.name}
                    previousReading={getLatestMeterReading(selectedCustomer.id, meterReadings)}
                    onSubmit={handleSubmitReading}
                />
            )}
        </div>
    );
}
