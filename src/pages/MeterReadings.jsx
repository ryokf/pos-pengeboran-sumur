import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, FilterBar, MeterReadingModal } from '../components';
import { formatDate, matchesSearch } from '../utils';
import {
    getCustomers,
    getCustomerMeterReadings,
    addMeterReading
} from '../services/customerService';

export default function MeterReadings() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [meterReadingsMap, setMeterReadingsMap] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Fetch all customers and their meter readings
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all customers
                const customersData = await getCustomers();
                setCustomers(customersData);

                // Fetch meter readings for all customers
                const readingsMap = {};
                for (const customer of customersData) {
                    const readings = await getCustomerMeterReadings(customer.id);
                    readingsMap[customer.id] = readings;
                }
                setMeterReadingsMap(readingsMap);

            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Gagal memuat data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter customers based on search
    const filteredCustomers = customers.filter(customer =>
        matchesSearch(searchTerm, customer.name, customer.phone, customer.email)
    );

    // Get latest meter reading for a customer
    const getLatestReading = (customerId) => {
        const readings = meterReadingsMap[customerId] || [];
        return readings.length > 0 ? readings[0] : null;
    };

    // Get previous meter reading for a customer
    const getPreviousReading = (customerId) => {
        const readings = meterReadingsMap[customerId] || [];
        return readings.length > 1 ? readings[1] : null;
    };

    // Calculate usage
    const calculateUsage = (latestReading, previousReading) => {
        if (!latestReading || !previousReading) return 0;
        return latestReading.usage_amount || 0;
    };

    // Handle opening modal for a customer
    const handleRecordReading = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    // Handle submitting new reading
    const handleSubmitReading = async (newReading) => {
        try {
            setSubmitting(true);

            // Get the latest reading for previous value
            const latestReading = getLatestReading(selectedCustomer.id);
            const previousValue = latestReading ? latestReading.current_value : 0;

            // Get current month and year from reading date
            const readingDate = new Date(newReading.readingDate);
            const currentMonth = readingDate.getMonth() + 1;
            const currentYear = readingDate.getFullYear();

            // Submit to database
            await addMeterReading(
                selectedCustomer.id,
                newReading.meterValue,
                currentMonth,
                currentYear,
                previousValue,
                newReading.notes || ''
            );

            // Refresh meter readings for this customer
            const updatedReadings = await getCustomerMeterReadings(selectedCustomer.id);
            setMeterReadingsMap(prev => ({
                ...prev,
                [selectedCustomer.id]: updatedReadings
            }));

            alert(`Pencatatan meteran untuk ${ selectedCustomer.name } berhasil disimpan!`);
            setShowModal(false);
            setSelectedCustomer(null);

        } catch (error) {
            console.error('Error submitting meter reading:', error);
            alert('Gagal menyimpan pencatatan meteran: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat data...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Pencatatan Sebelumnya</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Pencatatan Terakhir</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Penggunaan</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => {
                                const latestReading = getLatestReading(customer.id);
                                const previousReading = getPreviousReading(customer.id);
                                const usage = calculateUsage(latestReading, previousReading);

                                return (
                                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-medium text-gray-800">{customer.name}</p>
                                                <p className="text-sm text-gray-600">{customer.phone || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {previousReading ? (
                                                <div>
                                                    <p className="text-sm text-gray-600">{formatDate(previousReading.reading_date)}</p>
                                                    <p className="font-semibold text-gray-800">{previousReading.current_value} m³</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {latestReading ? (
                                                <div>
                                                    <p className="text-sm text-gray-600">{formatDate(latestReading.reading_date)}</p>
                                                    <p className="font-semibold text-blue-600">{latestReading.current_value} m³</p>
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
                    previousReading={getLatestReading(selectedCustomer.id)}
                    onSubmit={handleSubmitReading}
                    submitting={submitting}
                />
            )}
        </div>
    );
}
