import { useState, useMemo } from 'react';
import { PageHeader } from '../components';
import { dummyData } from '../data/dummyData';
import {
    formatCurrency,
    filterTransactionsByPeriod,
    calculateFinancialSummary,
    formatReportPeriod,
    getAvailableYears,
    getAvailableMonths
} from '../utils';

export default function FinancialReport() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const [period, setPeriod] = useState('monthly'); // 'monthly' or 'annual'
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const { transactions, customers } = dummyData;

    // Get available years and months
    const availableYears = useMemo(() => getAvailableYears(transactions), [transactions]);
    const availableMonths = useMemo(
        () => getAvailableMonths(transactions, selectedYear),
        [transactions, selectedYear]
    );

    // Filter transactions based on selected period
    const filteredTransactions = useMemo(() => {
        return filterTransactionsByPeriod(
            transactions,
            period,
            selectedYear,
            period === 'monthly' ? selectedMonth : null
        );
    }, [transactions, period, selectedYear, selectedMonth]);

    // Calculate financial summary
    const summary = useMemo(
        () => calculateFinancialSummary(filteredTransactions, customers),
        [filteredTransactions, customers]
    );

    const periodLabel = formatReportPeriod(period, selectedYear, selectedMonth);

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const handlePrint = () => {
        globalThis.print();
    };

    return (
        <div className="p-8">
            <PageHeader
                title="Laporan Keuangan"
                description="Rekap transaksi uang keluar masuk"
            />

            {/* Filter Controls - Hidden when printing */}
            <div className="no-print bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Period Type Selector */}
                    <div>
                        <label htmlFor="period-type-selector" className="block text-sm font-medium text-gray-700 mb-2">
                            Tipe Periode
                        </label>
                        <select
                            id="period-type-selector"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="monthly">Bulanan</option>
                            <option value="annual">Tahunan</option>
                        </select>
                    </div>

                    {/* Year Selector */}
                    <div>
                        <label htmlFor="year-selector" className="block text-sm font-medium text-gray-700 mb-2">
                            Tahun
                        </label>
                        <select
                            id="year-selector"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Month Selector - Only shown for monthly reports */}
                    {period === 'monthly' && (
                        <div>
                            <label htmlFor="month-selector" className="block text-sm font-medium text-gray-700 mb-2">
                                Bulan
                            </label>
                            <select
                                id="month-selector"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {availableMonths.map((month) => (
                                    <option key={month} value={month}>
                                        {monthNames[month - 1]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Print Button */}
                    <div className="flex items-end">
                        <button
                            onClick={handlePrint}
                            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            🖨️ Cetak PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Header - Visible in print */}
            <div className="print-only text-center mb-8 border-b-2 border-gray-800 pb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">POS PENGEBORAN SUMUR</h1>
                <p className="text-lg text-gray-600">Laporan Keuangan</p>
                <p className="text-md text-gray-600 mt-2">Periode: {periodLabel}</p>
                <p className="text-sm text-gray-500 mt-1">
                    Dicetak pada: {new Date().toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Income */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-green-700">Total Pemasukan</p>
                        <span className="text-2xl">📥</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(summary.totalIncome)}
                    </p>
                </div>

                {/* Total Expenses */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-red-700">Total Pengeluaran</p>
                        <span className="text-2xl">📤</span>
                    </div>
                    <p className="text-3xl font-bold text-red-600">
                        {formatCurrency(summary.totalExpenses)}
                    </p>
                </div>

                {/* Net Balance */}
                <div className={`${ summary.netBalance >= 0
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-orange-50 border-orange-200'
                    } border rounded-lg p-6`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-medium ${ summary.netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'
                            }`}>
                            Saldo / Total Kas
                        </p>
                        <span className="text-2xl">💰</span>
                    </div>
                    <p className={`text-3xl font-bold ${ summary.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                        {summary.netBalance >= 0 ? '+' : ''}{formatCurrency(Math.abs(summary.netBalance))}
                    </p>
                </div>

                {/* Outstanding Debts */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-yellow-700">Total Tunggakan</p>
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">
                        {formatCurrency(summary.outstandingDebts)}
                    </p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Detail Transaksi - {periodLabel}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Total {filteredTransactions.length} transaksi
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold">No</th>
                                <th className="text-left py-4 px-6 font-semibold">Tanggal</th>
                                <th className="text-left py-4 px-6 font-semibold">Kategori</th>
                                <th className="text-left py-4 px-6 font-semibold">Keterangan</th>
                                <th className="text-left py-4 px-6 font-semibold">Sumber/Tujuan</th>
                                <th className="text-right py-4 px-6 font-semibold">Nominal</th>
                                <th className="text-center py-4 px-6 font-semibold">Tipe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction, index) => (
                                    <tr
                                        key={transaction.id}
                                        className={`border-b border-gray-100 ${ index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            } hover:bg-gray-100 transition-colors`}
                                    >
                                        <td className="py-4 px-6 text-sm text-gray-600">{index + 1}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                                            {transaction.description}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {transaction.customer_name}
                                        </td>
                                        <td className={`py-4 px-6 text-right font-bold ${ transaction.type === 'IN' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'IN' ? '+' : '-'}
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ transaction.type === 'IN'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {transaction.type === 'IN' ? '📥 Masuk' : '📤 Keluar'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        Tidak ada transaksi untuk periode ini
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Row */}
                {filteredTransactions.length > 0 && (
                    <div className="bg-gray-100 border-t-2 border-gray-300 px-6 py-4">
                        <div className="grid grid-cols-3 gap-4 text-sm font-semibold">
                            <div className="text-green-700">
                                Total Pemasukan: {formatCurrency(summary.totalIncome)}
                            </div>
                            <div className="text-red-700">
                                Total Pengeluaran: {formatCurrency(summary.totalExpenses)}
                            </div>
                            <div className={`text-right ${ summary.netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'
                                }`}>
                                Saldo: {summary.netBalance >= 0 ? '+' : ''}
                                {formatCurrency(Math.abs(summary.netBalance))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          @page {
            margin: 1cm;
            size: A4 landscape;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
        
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>
        </div>
    );
}
