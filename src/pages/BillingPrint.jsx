import { useState, useEffect } from 'react';
import { formatCurrency } from '../utils';
import { getCustomers, getCustomerMeterReadings, getCustomerInvoices } from '../services/customerService';

export default function BillingPrint() {
    const [loading, setLoading] = useState(true);
    const [receiptList, setReceiptList] = useState([]);

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
                const receipts = await Promise.all(
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

                            return {
                                id: customer.id,
                                name: customer.name,
                                address: customer.address || '-',
                                phone: customer.phone || '-',
                                saldo: customer.current_balance || 0,
                                monthlyCharge,
                                currentMonthUsage,
                                totalUsageBeforeThisMonth,
                                latestReading,
                                previousReading
                            };
                        } catch (err) {
                            console.error(`Error fetching data for customer ${ customer.id }:`, err);
                            return {
                                id: customer.id,
                                name: customer.name,
                                address: customer.address || '-',
                                phone: customer.phone || '-',
                                saldo: customer.current_balance || 0,
                                monthlyCharge: 0,
                                currentMonthUsage: 0,
                                totalUsageBeforeThisMonth: 0,
                                latestReading: null,
                                previousReading: null
                            };
                        }
                    })
                );

                setReceiptList(receipts);
            } catch (err) {
                console.error('Error fetching billing data:', err);
                alert('Gagal memuat data tagihan: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    const handlePrint = () => {
        globalThis.print();
    };

    // Split receipts into pages (6 receipts per page: 3x2 grid)
    const receitsPerPage = 6;
    const pages = [];
    for (let i = 0; i < receiptList.length; i += receitsPerPage) {
        pages.push(receiptList.slice(i, i + receitsPerPage));
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat data tagihan...</p>
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
                        🖨️ Cetak Resi
                    </button>
                </div>
            )}

            {/* Printable Content */}
            {!loading && (
                <div>
                    {pages.map((pageReceipts, pageIndex) => (
                        <div key={`page-${ pageIndex }`} className="page-break w-full" style={{ pageBreakAfter: 'always', minHeight: '100vh' }}>
                            <div className="p-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '20px' }}>
                                {pageReceipts.map((customer) => {

                                    return (
                                        <div key={customer.id} className="border-2 border-gray-800 p-4 bg-white" style={{ fontSize: '11px' }}>
                                            {/* Header */}

                                            {/* Receipt Title */}
                                            <div className="text-center mb-2">
                                                <h2 className="text-sm font-bold">KUITANSI</h2>
                                                <p className="text-xs text-gray-600">Periode: {currentMonth}</p>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="space-y-1 mb-3 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Pelanggan :</span>
                                                    <span className="text-right">{customer.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Alamat :</span>
                                                    <span className="text-right">{customer.address}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Telepon :</span>
                                                    <span>{customer.phone}</span>
                                                </div>
                                            </div>

                                            {/* Water Usage */}
                                            <div className="bg-blue-50 border border-blue-300 p-2 rounded mb-3 text-xs">
                                                <p className="font-semibold text-gray-800 mb-1 text-center">Penggunaan Air</p>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-700">Sebelum:</span>
                                                    <span className="font-semibold">{customer.totalUsageBeforeThisMonth.toFixed(2)} m³</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-700">Bulan Ini:</span>
                                                    <span className="font-semibold text-blue-600">{customer.currentMonthUsage.toFixed(2)} m³</span>
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="bg-gray-100 border-2 border-gray-800 p-2 mb-3 text-center">
                                                <p className="text-xs text-gray-600 mb-1">Jumlah Uang</p>
                                                <p className="text-lg font-bold text-gray-800">{formatCurrency(customer.monthlyCharge)}</p>
                                            </div>

                                            {/* Debt Status */}
                                            <div className="border border-gray-800 p-2 text-center">
                                                {customer.saldo >= 0 ? (
                                                    <div className="bg-green-100 border border-green-500 rounded p-2">
                                                        <p className="font-bold text-green-700 text-sm">✓ LUNAS</p>
                                                    </div>
                                                ) : (
                                                    <div className="bg-red-100 border border-red-500 rounded p-2">
                                                        <p className="font-bold text-red-700 text-xs mb-1">HUTANG</p>
                                                        <p className="font-bold text-red-700 text-sm">{formatCurrency(Math.abs(customer.saldo))}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Empty cells for incomplete last page */}
                                {pageReceipts.length < receitsPerPage && Array.from({ length: receitsPerPage - pageReceipts.length }).map((_, i) => (
                                    <div key={`empty-${ pageIndex }-${ i }`}></div>
                                ))}
                            </div>
                        </div>
                    ))}
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
            size: A4;
          }
          
          .page-break {
            page-break-after: always;
          }
        }
      `}</style>
        </div>
    );
}
