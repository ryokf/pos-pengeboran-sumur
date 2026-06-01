import { useState, useEffect } from 'react';
import { formatCurrency } from '../utils';
import { getCustomers, getCustomerMeterReadings, getCustomerInvoices, getCustomerTransactions } from '../services/customerService';

export default function BillingPrint() {
    const [loading, setLoading] = useState(true);
    const [receiptList, setReceiptList] = useState([]);

    // Helper function to add 1 month to a date
    const addOneMonth = (dateString) => {
        const date = new Date(dateString);
        date.setMonth(date.getMonth() + 1);
        return date;
    };

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

                            // Get transactions for this customer
                            const transactions = await getCustomerTransactions(customer.id);

                            // Get the latest reading (first in the sorted array)
                            const latestReading = readings.length > 0 ? readings[0] : null;

                            // Get the previous reading (second in the sorted array)
                            const previousReading = readings.length > 1 ? readings[1] : null;

                            // Calculate current month usage - using current_value from readings
                            const currentMonthUsage = latestReading ? latestReading.current_value : 0;

                            // Calculate total usage before this month
                            const totalUsageBeforeThisMonth = previousReading ? previousReading.current_value : 0;

                            // Get the latest invoice
                            const latestInvoice = invoices.length > 0 ? invoices[0] : null;

                            // Calculate remaining amount after payments
                            let monthlyCharge = 0;
                            if (latestInvoice) {
                                const invoicePayments = transactions.filter(
                                    t => t.invoice_id === latestInvoice.id && t.type === 'OUT'
                                );
                                const totalPayments = invoicePayments.reduce((sum, t) => sum + (t.amount || 0), 0);
                                monthlyCharge = Math.max(0, latestInvoice.total_amount - totalPayments);
                            }

                            // Calculate usage difference (selisih penggunaan air)
                            const usageDifference = currentMonthUsage - totalUsageBeforeThisMonth;

                            // Get admin fee and amount from invoice
                            const adminFee = latestInvoice ? (latestInvoice.admin_fee || 0) : 0;
                            const waterChargeAmount = latestInvoice ? (latestInvoice.amount || 0) : 0;
                            const totalAmount = latestInvoice ? (latestInvoice.total_amount || 0) : 0;

                            // Get reading date
                            const readingDate = latestReading ? (() => {
                                const d = new Date(latestReading.reading_date);
                                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                            })() : (() => {
                                const d = new Date();
                                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                            })();

                            return {
                                id: customer.id,
                                name: customer.name,
                                address: customer.address || '-',
                                phone: customer.phone || '-',
                                rt: customer.rt || '-',
                                rw: customer.rw || '-',
                                saldo: customer.current_balance || 0,
                                monthlyCharge,
                                invoiceAmount: latestInvoice ? latestInvoice.total_amount : 0,
                                currentMonthUsage,
                                totalUsageBeforeThisMonth,
                                usageDifference,
                                waterChargeAmount,
                                adminFee,
                                totalAmount,
                                readingDate,
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
                                rt: customer.rt || '-',
                                rw: customer.rw || '-',
                                saldo: customer.current_balance || 0,
                                monthlyCharge: 0,
                                invoiceAmount: 0,
                                currentMonthUsage: 0,
                                totalUsageBeforeThisMonth: 0,
                                usageDifference: 0,
                                waterChargeAmount: 0,
                                adminFee: 0,
                                totalAmount: 0,
                                readingDate: (() => {
                                    const d = new Date();
                                    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                                })(),
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

                                    const periodMonth = customer.latestReading 
                                        ? addOneMonth(customer.latestReading.reading_date).toLocaleDateString('id-ID', {
                                            month: 'long',
                                            year: 'numeric'
                                          })
                                        : new Date().toLocaleDateString('id-ID', {
                                            month: 'long',
                                            year: 'numeric'
                                          });

                                    return (
                                        <div key={customer.id} className="receipt-item border-2 border-gray-800 p-4 bg-white" style={{ fontSize: '12px' }}>
                                            {/* Header */}

                                            {/* Receipt Title */}
                                            <div className="mb-1">
                                                <p className="text-gray-600 text-xs">Periode: {periodMonth}</p>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="space-y-0 mb-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="font-semibold">Nama :</span>
                                                    <span className="text-right">{customer.name}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="font-semibold">Alamat :</span>
                                                    <span className="text-right">{customer.address}</span>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-gray-400 my-1"></div>

                                            {/* Water Usage */}
                                            <div className="mb-2">
                                                <p className="font-semibold text-gray-800 text-xs mb-0">Penggunaan Air (m³)</p>

                                                <div className="flex justify-between mb-0 text-xs">
                                                    <span className="text-gray-700">Bulan Lalu :</span>
                                                    <span className="font-semibold">{customer.totalUsageBeforeThisMonth.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between mb-0 text-xs">
                                                    <span className="text-gray-700">Bulan Ini :</span>
                                                    <span className="font-semibold text-blue-600">{customer.currentMonthUsage.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-gray-300 pt-0 text-xs">
                                                    <span className="text-gray-700 font-semibold">Selisih :</span>
                                                    <span className="font-semibold text-green-600">{customer.usageDifference.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-gray-400 my-1"></div>

                                            {/* Billing Details */}
                                            <div className="space-y-0 mb-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-700">Biaya Air :</span>
                                                    <span className="font-semibold">{formatCurrency(customer.waterChargeAmount)}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-700">Biaya Admin :</span>
                                                    <span className="font-semibold">{formatCurrency(customer.adminFee)}</span>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t-2 border-gray-800 my-1"></div>

                                            {/* Total Amount */}
                                            <div className="bg-gray-100 border-2 border-gray-800 p-1 text-center">
                                                <p className="text-gray-600 text-xs mb-0">Total Dibayar</p>
                                                <p className="font-bold text-sm text-gray-800">{formatCurrency(customer.totalAmount)}</p>
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
          
          .receipt-item {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
        </div>
    );
}
