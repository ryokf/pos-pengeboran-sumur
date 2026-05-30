import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatCurrency } from '../utils';
import { getTransactionsByPeriod } from '../services/transactionService';

export default function FinancialReportPrint() {
    const [searchParams] = useSearchParams();
    const period = searchParams.get('period') || 'monthly';
    const selectedYear = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const selectedMonth = parseInt(searchParams.get('month')) || (new Date().getMonth() + 1);

    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getTransactionsByPeriod(
                    selectedYear,
                    period === 'monthly' ? selectedMonth : null
                );
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [period, selectedYear, selectedMonth]);

    const { incomeTransactions, expenseTransactions, totalIncome, totalExpenses, saldoAkhir } = useMemo(() => {
        const reportTransactions = transactions.filter(t => t.category !== 'Pembayaran Tagihan');

        const allIncome = reportTransactions
            .filter(t => t.type === 'IN')
            .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));

        // Separate Top Up transactions from other income
        const topUpTransactions = allIncome.filter(t => t.category === 'Top Up');
        const otherIncome = allIncome.filter(t => t.category !== 'Top Up');

        // Consolidate all Top Up into a single summary row
        const income = [...otherIncome];
        if (topUpTransactions.length > 0) {
            const totalTopUp = topUpTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
            income.push({
                id: 'topup-summary',
                transaction_date: topUpTransactions[topUpTransactions.length - 1].transaction_date,
                description: 'Pemasukan Tunai',
                category: 'Top Up',
                amount: totalTopUp,
                type: 'IN'
            });
            // Sort again after adding summary row
            income.sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));
        }

        const expense = reportTransactions
            .filter(t => t.type === 'OUT')
            .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));

        const totalIn = allIncome.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalOut = expense.reduce((sum, t) => sum + (t.amount || 0), 0);

        return {
            incomeTransactions: income,
            expenseTransactions: expense,
            totalIncome: totalIn,
            totalExpenses: totalOut,
            saldoAkhir: totalIn - totalOut
        };
    }, [transactions]);

    const maxRows = Math.max(incomeTransactions.length, expenseTransactions.length, 1);

    // Helper: get number of days in selected month
    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

    // Period label
    const periodTitle = period === 'monthly'
        ? `PERIODE 1 - ${getDaysInMonth(selectedYear, selectedMonth)} ${monthNames[selectedMonth - 1].toUpperCase()} ${selectedYear}`
        : `PERIODE TAHUN ${selectedYear}`;

    const formatRp = (amount) => {
        return new Intl.NumberFormat('id-ID').format(amount);
    };

    const formatTanggal = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const handlePrint = () => {
        globalThis.print();
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666' }}>Memuat data laporan...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            {/* Print Button */}
            <div className="no-print" style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50, display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        background: '#6b7280',
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '14px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    ← Kembali
                </button>
                <button
                    onClick={handlePrint}
                    style={{
                        background: '#2563eb',
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '14px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    🖨️ Cetak Laporan
                </button>
            </div>

            {/* Printable Content */}
            <div className="print-container" style={{ padding: '20px 30px', maxWidth: '1100px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <h1 style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#dc2626',
                        margin: '0 0 2px 0',
                        fontFamily: 'Arial, sans-serif',
                        letterSpacing: '1px'
                    }}>
                        LAPORAN KEUANGAN
                    </h1>
                    <h2 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#dc2626',
                        margin: '0 0 2px 0',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        SUMUR AN-NUUR PUCANG ANOM TIMUR RW XX
                    </h2>
                    <p style={{
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#dc2626',
                        margin: 0,
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        {periodTitle}
                    </p>
                </div>

                {/* Main Table */}
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '13px'
                }}>
                    {/* Table Header Row 1 */}
                    <thead>
                        <tr>
                            <th colSpan="3" style={{
                                border: '2px solid #000',
                                padding: '8px 12px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                background: '#fff'
                            }}>
                                PEMASUKAN
                            </th>
                            <th colSpan="3" style={{
                                border: '2px solid #000',
                                padding: '8px 12px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                background: '#fff'
                            }}>
                                PENGELUARAN
                            </th>
                        </tr>
                        {/* Table Header Row 2 */}
                        <tr>
                            <th style={{
                                border: '2px solid #000',
                                padding: '6px 10px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                background: '#fff',
                                width: '12%'
                            }}>
                                TANGGAL
                            </th>
                            <th style={{
                                border: '2px solid #000',
                                padding: '6px 10px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                background: '#fff',
                                width: '22%'
                            }}>
                                KETERANGAN
                            </th>
                            <th style={{
                                border: '2px solid #000',
                                padding: '6px 10px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                background: '#fff',
                                width: '16%'
                            }}>
                                JUMLAH
                            </th>
                            <th style={{
                                border: '2px solid #000',
                                padding: '6px 10px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                background: '#fff',
                                width: '12%'
                            }}>
                                TANGGAL
                            </th>
                            <th style={{
                                border: '2px solid #000',
                                padding: '6px 10px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                background: '#fff',
                                width: '22%'
                            }}>
                                KETERANGAN
                            </th>
                            <th style={{
                                border: '2px solid #000',
                                padding: '6px 10px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                background: '#fff',
                                width: '16%'
                            }}>
                                JUMLAH
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Data Rows */}
                        {Array.from({ length: maxRows }).map((_, index) => {
                            const inc = incomeTransactions[index];
                            const exp = expenseTransactions[index];
                            return (
                                <tr key={index}>
                                    {/* PEMASUKAN columns */}
                                    <td style={{
                                        border: '1px solid #000',
                                        borderLeft: '2px solid #000',
                                        padding: '5px 8px',
                                        textAlign: 'center',
                                        verticalAlign: 'top'
                                    }}>
                                        {inc ? formatTanggal(inc.transaction_date) : ''}
                                    </td>
                                    <td style={{
                                        border: '1px solid #000',
                                        padding: '5px 8px',
                                        textAlign: 'left',
                                        verticalAlign: 'top'
                                    }}>
                                        {inc ? (inc.description || inc.category) : ''}
                                    </td>
                                    <td style={{
                                        border: '1px solid #000',
                                        borderRight: '2px solid #000',
                                        padding: '5px 8px',
                                        textAlign: 'right',
                                        verticalAlign: 'top',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {inc ? (
                                            <span>
                                                <span style={{ float: 'left' }}>Rp</span>
                                                {formatRp(inc.amount)}
                                            </span>
                                        ) : ''}
                                    </td>
                                    {/* PENGELUARAN columns */}
                                    <td style={{
                                        border: '1px solid #000',
                                        borderLeft: '2px solid #000',
                                        padding: '5px 8px',
                                        textAlign: 'center',
                                        verticalAlign: 'top'
                                    }}>
                                        {exp ? formatTanggal(exp.transaction_date) : ''}
                                    </td>
                                    <td style={{
                                        border: '1px solid #000',
                                        padding: '5px 8px',
                                        textAlign: 'left',
                                        verticalAlign: 'top'
                                    }}>
                                        {exp ? (exp.description || exp.category) : ''}
                                    </td>
                                    <td style={{
                                        border: '1px solid #000',
                                        borderRight: '2px solid #000',
                                        padding: '5px 8px',
                                        textAlign: 'right',
                                        verticalAlign: 'top',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {exp ? (
                                            <span>
                                                <span style={{ float: 'left' }}>Rp</span>
                                                {formatRp(exp.amount)}
                                            </span>
                                        ) : ''}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Empty rows for spacing if needed (min 5 rows) */}
                        {maxRows < 2 && Array.from({ length: 2 - maxRows }).map((_, i) => (
                            <tr key={`empty-${i}`}>
                                <td style={{ border: '1px solid #000', borderLeft: '2px solid #000', padding: '5px 8px', height: '28px' }}>&nbsp;</td>
                                <td style={{ border: '1px solid #000', padding: '5px 8px' }}>&nbsp;</td>
                                <td style={{ border: '1px solid #000', borderRight: '2px solid #000', padding: '5px 8px' }}>&nbsp;</td>
                                <td style={{ border: '1px solid #000', borderLeft: '2px solid #000', padding: '5px 8px' }}>&nbsp;</td>
                                <td style={{ border: '1px solid #000', padding: '5px 8px' }}>&nbsp;</td>
                                <td style={{ border: '1px solid #000', borderRight: '2px solid #000', padding: '5px 8px' }}>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                    {/* Footer: JUMLAH + SALDO AKHIR */}
                    <tfoot>
                        {/* JUMLAH row */}
                        <tr>
                            <td colSpan="2" style={{
                                border: '2px solid #000',
                                padding: '8px 12px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                                JUMLAH
                            </td>
                            <td style={{
                                border: '2px solid #000',
                                padding: '8px 12px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                whiteSpace: 'nowrap'
                            }}>
                                <span style={{ float: 'left' }}>Rp</span>
                                {formatRp(totalIncome)}
                            </td>
                            <td colSpan="2" style={{
                                border: '2px solid #000',
                                padding: '8px 12px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                                JUMLAH
                            </td>
                            <td style={{
                                border: '2px solid #000',
                                padding: '8px 12px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                whiteSpace: 'nowrap'
                            }}>
                                <span style={{ float: 'left' }}>Rp</span>
                                {formatRp(totalExpenses)}
                            </td>
                        </tr>
                        {/* SALDO AKHIR row */}
                        <tr>
                            <td colSpan="2" style={{
                                border: '2px solid #000',
                                padding: '8px 12px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                color: '#dc2626',
                                background: '#fef9c3'
                            }}>
                                SALDO AKHIR
                            </td>
                            <td style={{
                                border: '2px solid #000',
                                padding: '8px 12px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                color: '#dc2626',
                                background: '#fef9c3',
                                whiteSpace: 'nowrap'
                            }}>
                                <span style={{ float: 'left' }}>Rp</span>
                                {formatRp(saldoAkhir)}
                            </td>
                            <td colSpan="3" style={{
                                border: '2px solid #000',
                                padding: '8px 12px',
                                background: '#fff'
                            }}>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }

                    html, body {
                        margin: 0;
                        padding: 0;
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        overflow: hidden;
                    }

                    @page {
                        margin: 0.8cm;
                        size: A4 landscape;
                    }

                    /* Force single page */
                    .print-container {
                        page-break-inside: avoid;
                        break-inside: avoid;
                        page-break-after: avoid;
                        break-after: avoid;
                        max-height: 100vh;
                        overflow: hidden;
                    }

                    table {
                        font-size: 11px !important;
                    }

                    table th, table td {
                        padding: 3px 6px !important;
                    }

                    table tfoot td {
                        padding: 4px 8px !important;
                    }
                }

                @media screen {
                    body {
                        background: #f3f4f6;
                    }
                }
            `}</style>
        </div>
    );
}
