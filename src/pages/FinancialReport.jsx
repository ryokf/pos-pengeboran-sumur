import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../components';
import { formatCurrency } from '../utils';
import { getTransactionsByPeriod, addTransaction } from '../services/transactionService';
import { getCustomers } from '../services/customerService';

export default function FinancialReport() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const [period, setPeriod] = useState('monthly'); // 'monthly' or 'annual'
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeCategory, setIncomeCategory] = useState('Pemasukan Lain');
    const [incomeDescription, setIncomeDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('Operasional');
    const [expenseDescription, setExpenseDescription] = useState('');

    // Fetch data when period changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch transactions for selected period
                const transactionsData = await getTransactionsByPeriod(
                    selectedYear,
                    period === 'monthly' ? selectedMonth : null
                );

                // Fetch customers for outstanding debts calculation
                const customersData = await getCustomers();

                setTransactions(transactionsData);
                setCustomers(customersData);

            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Gagal memuat data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period, selectedYear, selectedMonth]);

    // Calculate financial summary
    const summary = useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.type === 'IN')
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'OUT')
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        const netBalance = totalIncome - totalExpenses;

        // Calculate outstanding debts (customers with negative balance)
        const outstandingDebts = customers
            .filter(c => c.current_balance < 0)
            .reduce((sum, c) => sum + Math.abs(c.current_balance), 0);

        return {
            totalIncome,
            totalExpenses,
            netBalance,
            outstandingDebts
        };
    }, [transactions, customers]);

    // Get available years from transactions
    const availableYears = useMemo(() => {
        if (transactions.length === 0) return [currentYear];

        const years = transactions.map(t => new Date(t.transaction_date).getFullYear());
        const uniqueYears = [...new Set(years)].sort((a, b) => b - a);

        return uniqueYears.length > 0 ? uniqueYears : [currentYear];
    }, [transactions, currentYear]);

    // Get available months for selected year
    const availableMonths = useMemo(() => {
        const months = transactions
            .filter(t => new Date(t.transaction_date).getFullYear() === selectedYear)
            .map(t => new Date(t.transaction_date).getMonth() + 1);

        const uniqueMonths = [...new Set(months)].sort((a, b) => a - b);

        return uniqueMonths.length > 0 ? uniqueMonths : [currentMonth];
    }, [transactions, selectedYear, currentMonth]);

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const periodLabel = period === 'monthly'
        ? `${ monthNames[selectedMonth - 1] } ${ selectedYear }`
        : `Tahun ${ selectedYear }`;

    const handlePrint = () => {
        globalThis.print();
    };

    // Handle add income
    const handleAddIncome = async () => {
        if (!incomeAmount || parseFloat(incomeAmount) <= 0) {
            alert('Masukkan jumlah yang valid');
            return;
        }

        try {
            setSubmitting(true);

            await addTransaction({
                type: 'IN',
                category: incomeCategory,
                amount: parseFloat(incomeAmount),
                description: incomeDescription || 'Pemasukan',
                transaction_date: new Date().toISOString().split('T')[0],
                customer_id: null
            });

            // Refresh transactions
            const updatedTransactions = await getTransactionsByPeriod(
                selectedYear,
                period === 'monthly' ? selectedMonth : null
            );
            setTransactions(updatedTransactions);

            alert(`Pemasukan sebesar ${ formatCurrency(parseFloat(incomeAmount)) } berhasil ditambahkan!`);
            setShowIncomeModal(false);
            setIncomeAmount('');
            setIncomeCategory('Pemasukan Lain');
            setIncomeDescription('');

        } catch (error) {
            console.error('Error adding income:', error);
            alert('Gagal menambahkan pemasukan: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle add expense
    const handleAddExpense = async () => {
        if (!expenseAmount || parseFloat(expenseAmount) <= 0) {
            alert('Masukkan jumlah yang valid');
            return;
        }

        try {
            setSubmitting(true);

            await addTransaction({
                type: 'OUT',
                category: expenseCategory,
                amount: parseFloat(expenseAmount),
                description: expenseDescription || 'Pengeluaran',
                transaction_date: new Date().toISOString().split('T')[0],
                customer_id: null
            });

            // Refresh transactions
            const updatedTransactions = await getTransactionsByPeriod(
                selectedYear,
                period === 'monthly' ? selectedMonth : null
            );
            setTransactions(updatedTransactions);

            alert(`Pengeluaran sebesar ${ formatCurrency(parseFloat(expenseAmount)) } berhasil ditambahkan!`);
            setShowExpenseModal(false);
            setExpenseAmount('');
            setExpenseCategory('Operasional');
            setExpenseDescription('');

        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Gagal menambahkan pengeluaran: ' + error.message);
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
            <div className="no-print">
                <PageHeader
                    title="Laporan Keuangan"
                    description="Rekap transaksi uang keluar masuk"
                />
            </div>

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

                {/* Add Income/Expense Buttons */}
                <div className="mt-4 flex gap-3">
                    <button
                        onClick={() => setShowIncomeModal(true)}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        💰 Tambah Pemasukan
                    </button>
                    <button
                        onClick={() => setShowExpenseModal(true)}
                        className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        💸 Tambah Pengeluaran
                    </button>
                </div>
            </div>

            {/* Report Header - Visible in print */}
            <div className="print-only text-center mb-8 border-b-2 border-gray-800 pb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">SISTEM KELOLA TAGIHAN AIR</h1>
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

            {/* Summary Cards - Hidden in print */}
            <div className="no-print grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                        Total {transactions.length} transaksi
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
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <tr
                                        key={transaction.id}
                                        className={`border-b border-gray-100 ${ index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            } hover:bg-gray-100 transition-colors`}
                                    >
                                        <td className="py-4 px-6 text-sm text-gray-600">{index + 1}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
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
                                            {transaction.customers?.name || 'Internal'}
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
                {transactions.length > 0 && (
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

            {/* Income Modal */}
            {showIncomeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Tambah Pemasukan</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label htmlFor="income-category" className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                <select
                                    id="income-category"
                                    value={incomeCategory}
                                    onChange={(e) => setIncomeCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={submitting}
                                >
                                    <option value="Pembayaran Bulanan">Pembayaran Bulanan</option>
                                    <option value="Top Up">Top Up</option>
                                    <option value="Pemasukan Lain">Pemasukan Lain</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="income-amount" className="block text-sm font-medium text-gray-700 mb-2">Jumlah Pemasukan</label>
                                <input
                                    id="income-amount"
                                    type="number"
                                    value={incomeAmount}
                                    onChange={(e) => setIncomeAmount(e.target.value)}
                                    placeholder="Masukkan jumlah (dalam Rupiah)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={submitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="income-desc" className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                <textarea
                                    id="income-desc"
                                    value={incomeDescription}
                                    onChange={(e) => setIncomeDescription(e.target.value)}
                                    placeholder="Masukkan keterangan pemasukan"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    rows="3"
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowIncomeModal(false);
                                    setIncomeAmount('');
                                    setIncomeCategory('Pemasukan Lain');
                                    setIncomeDescription('');
                                }}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddIncome}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Expense Modal */}
            {showExpenseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">💸 Tambah Pengeluaran</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                <select
                                    id="expense-category"
                                    value={expenseCategory}
                                    onChange={(e) => setExpenseCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    disabled={submitting}
                                >
                                    <option value="Operasional">Operasional</option>
                                    <option value="Gaji Karyawan">Gaji Karyawan</option>
                                    <option value="Perawatan Sumur">Perawatan Sumur</option>
                                    <option value="Peralatan">Peralatan</option>
                                    <option value="Pengeluaran Lain">Pengeluaran Lain</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-2">Jumlah Pengeluaran</label>
                                <input
                                    id="expense-amount"
                                    type="number"
                                    value={expenseAmount}
                                    onChange={(e) => setExpenseAmount(e.target.value)}
                                    placeholder="Masukkan jumlah (dalam Rupiah)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    disabled={submitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="expense-desc" className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                <textarea
                                    id="expense-desc"
                                    value={expenseDescription}
                                    onChange={(e) => setExpenseDescription(e.target.value)}
                                    placeholder="Masukkan keterangan pengeluaran"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    rows="3"
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowExpenseModal(false);
                                    setExpenseAmount('');
                                    setExpenseCategory('Operasional');
                                    setExpenseDescription('');
                                }}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddExpense}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
            margin: 1.5cm;
            size: A4 landscape;
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
