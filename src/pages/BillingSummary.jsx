import { useState, useEffect } from 'react';
import { formatCurrency } from '../utils';
import { getCustomers, getCustomerMeterReadings, getCustomerInvoices } from '../services/customerService';

export default function BillingSummary() {
    const [loading, setLoading] = useState(true);
    const [summaryList, setSummaryList] = useState([]);
    const [totalBilling, setTotalBilling] = useState(0);
    const [totalWaterUsage, setTotalWaterUsage] = useState(0);

    const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const currentMonth = new Date().toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
    });

    // Fetch all customers and their billing data
    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                setLoading(true);

                // Get all customers
                const customers = await getCustomers();

                // For each customer, get their latest meter reading and invoice
                const summariesWithData = await Promise.all(
                    customers.map(async (customer) => {
                        try {
                            // Get meter readings for this customer
                            const readings = await getCustomerMeterReadings(customer.id);

                            // Get invoices for this customer
                            const invoices = await getCustomerInvoices(customer.id);

                            // Get the latest reading (first in the sorted array)
                            const latestReading = readings.length > 0 ? readings[0] : null;

                            // Get the previous reading (second in the sorted array)
                            const previousReading = readings.length > 1 ? readings[1] : null;

                            // Calculate current month usage
                            const currentMonthUsage = latestReading ? latestReading.usage_amount : 0;

                            // Calculate total usage before this month
                            const totalUsageBeforeThisMonth = previousReading ? previousReading.current_value : 0;

                            // Get the latest invoice
                            const latestInvoice = invoices.length > 0 ? invoices[0] : null;
                            const monthlyCharge = latestInvoice ? latestInvoice.total_amount : 0;

                            // Calculate price per m3 from the invoice
                            const pricePerM3 = latestInvoice && currentMonthUsage > 0
                                ? latestInvoice.amount / currentMonthUsage
                                : 0;

                            return {
                                id: customer.id,
                                name: customer.name,
                                phone: customer.phone || '-',
                                wellSize: customer.total_usage_m3 || 0,
                                saldo: customer.current_balance || 0,
                                monthlyCharge,
                                pricePerM3,
                                currentMonthUsage,
                                totalUsageBeforeThisMonth,
                                latestReading,
                                previousReading,
                                hasInvoice: latestInvoice !== null
                            };
                        } catch (err) {
                            console.error(`Error fetching data for customer ${ customer.id }:`, err);
                            return {
                                id: customer.id,
                                name: customer.name,
                                phone: customer.phone || '-',
                                wellSize: customer.total_usage_m3 || 0,
                                saldo: customer.current_balance || 0,
                                monthlyCharge: 0,
                                pricePerM3: 0,
                                currentMonthUsage: 0,
                                totalUsageBeforeThisMonth: 0,
                                latestReading: null,
                                previousReading: null,
                                hasInvoice: false
                            };
                        }
                    })
                );

                // Filter to only show customers who have at least one invoice
                const summaries = summariesWithData.filter(s => s.hasInvoice);

                setSummaryList(summaries);

                // Calculate totals
                const totalBill = summaries.reduce((sum, c) => sum + c.monthlyCharge, 0);
                const totalUsage = summaries.reduce((sum, c) => sum + c.currentMonthUsage, 0);

                setTotalBilling(totalBill);
                setTotalWaterUsage(totalUsage);

            } catch (err) {
                console.error('Error fetching billing data:', err);
                alert('Gagal memuat data rekap tagihan: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat data rekap tagihan...</p>
                    </div>
                </div>
            )}

            {/* Print Button - Hidden when printing */}
            {!loading && (
                <div className="no-print fixed top-4 right-4 z-50">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        🖨️ Cetak Rekap
                    </button>
                </div>
            )}

            {/* Printable Content */}
            {!loading && (
                <div className="max-w-6xl mx-auto p-8">
                    {/* Header */}
                    <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">SISTEM KELOLA TAGIHAN AIR</h1>
                        <p className="text-lg text-gray-600">Rekap Resi Bulanan</p>
                        <p className="text-md text-gray-600 mt-2">Periode: {currentMonth}</p>
                        <p className="text-sm text-gray-500 mt-1">Dicetak pada: {currentDate}</p>
                    </div>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-4 gap-4 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 font-medium mb-1">Total Pelanggan</p>
                            <p className="text-3xl font-bold text-gray-800">{summaryList.length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 font-medium mb-1">Total Tagihan</p>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBilling)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 font-medium mb-1">Total Penggunaan Air</p>
                            <p className="text-2xl font-bold text-green-600">{totalWaterUsage.toFixed(2)} m³</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 font-medium mb-1">Rata-rata Tagihan</p>
                            <p className="text-2xl font-bold text-purple-600">{summaryList.length > 0 ? formatCurrency(totalBilling / summaryList.length) : formatCurrency(0)}</p>
                        </div>
                    </div>

                    {/* Details Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">No.</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Nama Pelanggan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Total Penggunaan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Penggunaan Bulan Ini</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Tarif/m³</th>
                                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Total Tagihan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryList.map((customer, index) => (
                                    <tr key={customer.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="border border-gray-300 px-4 py-3 text-center">{index + 1}</td>
                                        <td className="border border-gray-300 px-4 py-3">
                                            <p className="font-medium text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-600">{customer.phone}</p>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center">{customer.wellSize.toFixed(2)} m³</td>
                                        <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                                            {customer.currentMonthUsage.toFixed(2)} m³
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center">
                                            {formatCurrency(customer.pricePerM3)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right font-bold text-blue-600">
                                            {formatCurrency(customer.monthlyCharge)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-800 text-white font-bold">
                                    <td colSpan="5" className="border border-gray-300 px-4 py-3 text-right">
                                        TOTAL:
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right">
                                        {formatCurrency(totalBilling)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Footer Notes */}
                    <div className="mt-8 text-center border-t-2 border-gray-800 pt-6">
                        <p className="text-sm text-gray-600 mb-2">Dokumen ini adalah ringkasan resi tagihan bulan {currentMonth}</p>
                        <p className="text-xs text-gray-500">Untuk informasi lebih detail, silakan cetak daftar tagihan lengkap</p>
                    </div>
                </div>
            )}

            {/* Print Styles */}
            <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          @page {
            margin: 0.5cm;
            size: A4 landscape;
          }
          
          .max-w-6xl {
            max-width: 100% !important;
            padding: 0.5cm !important;
          }
          
          table {
            page-break-inside: avoid;
            font-size: 10px !important;
          }
          
          table th,
          table td {
            padding: 6px 8px !important;
          }
          
          h1 {
            font-size: 20px !important;
          }
          
          .text-lg {
            font-size: 14px !important;
          }
          
          .text-md {
            font-size: 12px !important;
          }
          
          .text-sm {
            font-size: 10px !important;
          }
          
          .text-xs {
            font-size: 9px !important;
          }
          
          .grid-cols-4 {
            gap: 8px !important;
          }
          
          .text-2xl {
            font-size: 16px !important;
          }
          
          .text-3xl {
            font-size: 18px !important;
          }
        }
      `}</style>
        </div>
    );
}
