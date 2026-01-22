import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, MeterReadingModal } from '../components';
import {
  formatCurrency
} from '../utils';
import {
  getCustomerById,
  getCustomerMeterReadings,
  getCustomerTransactions,
  getCustomerInvoices,
  addTopUp,
  addAdjustment,
  addMeterReading,
  payAllUnpaidInvoices,
  autoPayInvoicesAfterTopUp
} from '../services/customerService';

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [meterReadings, setMeterReadings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showMeterModal, setShowMeterModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [submitting, setSubmitting] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch all customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch customer details
        const customerData = await getCustomerById(customerId);
        setCustomer(customerData);

        // Fetch meter readings
        const readingsData = await getCustomerMeterReadings(customerId);
        setMeterReadings(readingsData);

        // Fetch transactions
        const transactionsData = await getCustomerTransactions(customerId);
        setTransactions(transactionsData);

        // Fetch invoices
        const invoicesData = await getCustomerInvoices(customerId);
        setInvoices(invoicesData);

      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  // Handle top up submission
  const handleTopUp = async () => {
    if (!topUpAmount || Number.parseFloat(topUpAmount) <= 0) {
      alert('Masukkan jumlah yang valid');
      return;
    }

    try {
      setSubmitting(true);
      const topUpValue = Number.parseFloat(topUpAmount);

      // 1. Add top-up transaction
      await addTopUp(customerId, topUpValue);

      // 2. Auto-pay unpaid invoices using top-up amount
      const paymentResult = await autoPayInvoicesAfterTopUp(customerId, topUpValue);

      // 3. Wait a moment to ensure all database transactions are committed
      await new Promise(resolve => setTimeout(resolve, 500));

      // 4. Refresh all customer data in the correct order
      // First refresh transactions to get the latest payment records
      const updatedTransactions = await getCustomerTransactions(customerId);
      setTransactions(updatedTransactions);

      // Then refresh invoices to get updated statuses
      const updatedInvoices = await getCustomerInvoices(customerId);
      setInvoices(updatedInvoices);

      // Finally refresh customer balance
      const updatedCustomer = await getCustomerById(customerId);
      setCustomer(updatedCustomer);

      // 5. Show success message with payment details
      alert(
        `Top up berhasil!\n\n` +
        `- Jumlah top-up: ${ formatCurrency(topUpValue) }\n` +
        `- Tagihan dibayar: ${ paymentResult.invoices_paid }\n` +
        `- Total pembayaran: ${ formatCurrency(paymentResult.total_amount_paid) }\n` +
        `- Saldo akhir: ${ formatCurrency(paymentResult.new_balance) }`
      );

      setShowTopUpModal(false);
      setTopUpAmount('');
    } catch (err) {
      console.error('Error processing top up:', err);
      alert('Gagal memproses top up: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle adjustment submission
  const handleAdjustment = async () => {
    if (!adjustmentAmount || Number.parseFloat(adjustmentAmount) <= 0) {
      alert('Masukkan jumlah yang valid');
      return;
    }

    try {
      setSubmitting(true);
      await addAdjustment(customerId, Number.parseFloat(adjustmentAmount), adjustmentType);

      // Refresh customer data
      const updatedCustomer = await getCustomerById(customerId);
      setCustomer(updatedCustomer);

      const action = adjustmentType === 'add' ? 'Penambahan' : 'Pengurangan';
      alert(`${ action } saldo sebesar ${ formatCurrency(Number.parseFloat(adjustmentAmount)) } berhasil diproses!`);
      setShowAdjustmentModal(false);
      setAdjustmentAmount('');
      setAdjustmentType('add');
    } catch (err) {
      console.error('Error processing adjustment:', err);
      alert('Gagal memproses penyesuaian: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle pay all unpaid invoices
  const handlePayAllInvoices = async () => {
    try {
      setSubmitting(true);

      const result = await payAllUnpaidInvoices(customerId);

      if (!result.success) {
        alert('Gagal membayar tagihan: ' + result.message);
        return;
      }

      // Refresh all data
      const updatedCustomer = await getCustomerById(customerId);
      setCustomer(updatedCustomer);

      const updatedInvoices = await getCustomerInvoices(customerId);
      setInvoices(updatedInvoices);

      const updatedTransactions = await getCustomerTransactions(customerId);
      setTransactions(updatedTransactions);

      alert(`Berhasil membayar tagihan!\n\n- Jumlah tagihan dibayar: ${ result.invoices_paid }\n- Total pembayaran: Rp ${ result.total_amount_paid.toLocaleString('id-ID') }\n- Saldo tersisa: Rp ${ result.new_balance.toLocaleString('id-ID') }`);

    } catch (err) {
      console.error('Error paying invoices:', err);
      alert('Gagal membayar tagihan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle meter reading submission
  const handleMeterReading = async (newReading) => {
    try {
      setSubmitting(true);

      // Use period from the form (not current month/year)
      const periodMonth = newReading.periodMonth;
      const periodYear = newReading.periodYear;

      // Submit to database - pass the complete object
      // Database trigger will handle previous_value and current_value calculation
      const result = await addMeterReading(newReading);

      // Refresh all data (meter readings, invoices, and customer balance)
      const updatedReadings = await getCustomerMeterReadings(customerId);
      setMeterReadings(updatedReadings);

      const updatedInvoices = await getCustomerInvoices(customerId);
      setInvoices(updatedInvoices);

      const updatedCustomer = await getCustomerById(customerId);
      setCustomer(updatedCustomer);

      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const periodName = `${ monthNames[periodMonth - 1] } ${ periodYear }`;

      alert(`Pencatatan meteran berhasil disimpan!\n\nPeriode: ${ periodName }\nTagihan otomatis dibuat:\n- Penggunaan: ${ result.meterReading.usage_amount } m³\n- Total Tagihan: Rp ${ result.invoice.total_amount.toLocaleString('id-ID') }`);
      setShowMeterModal(false);
    } catch (err) {
      console.error('Error saving meter reading:', err);
      alert('Gagal menyimpan pencatatan meteran: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data pelanggan...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8">
        <PageHeader title="Error" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-4">
          <p className="text-red-800">Terjadi kesalahan: {error}</p>
          <button
            onClick={() => navigate('/customers')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali ke Pelanggan
          </button>
        </div>
      </div>
    );
  }

  // Customer not found
  if (!customer) {
    return (
      <div className="p-8">
        <PageHeader title="Pelanggan Tidak Ditemukan" />
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Kembali ke Pelanggan
        </button>
      </div>
    );
  }

  const balance = customer.current_balance || 0;

  // Get available years from data
  const getAvailableYears = () => {
    const years = new Set();

    // Get years from meter readings
    meterReadings.forEach(r => years.add(r.period_year));

    // Get years from invoices
    invoices.forEach(inv => {
      const invDate = new Date(inv.created_at);
      years.add(invDate.getFullYear());
    });

    // Get years from transactions
    transactions.forEach(t => {
      const tDate = new Date(t.transaction_date);
      years.add(tDate.getFullYear());
    });

    // Always include current year
    years.add(new Date().getFullYear());

    return Array.from(years).sort((a, b) => b - a); // Sort descending
  };

  const availableYears = getAvailableYears();

  // Build monthly billing data - only show months with activity
  const buildMonthlyData = () => {
    const monthlyData = [];

    // Iterate through all 12 months of the selected year
    for (let month = 1; month <= 12; month++) {
      const year = selectedYear;
      const monthDate = new Date(year, month - 1, 1);
      const monthYear = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

      // Find meter reading for this month
      const reading = meterReadings.find(r => r.period_month === month && r.period_year === year);

      // Find invoice for this month by reading_id (not created_at)
      // This ensures invoice appears in correct period regardless of creation date
      const invoice = reading
        ? invoices.find(inv => inv.reading_id === reading.id)
        : null;

      // Find payments for this invoice (by invoice_id, not by month!)
      const invoicePayments = invoice
        ? transactions.filter(t => t.invoice_id === invoice.id && t.type === 'OUT')
        : [];

      const totalPayment = invoicePayments.reduce((sum, t) => sum + (t.amount || 0), 0);

      // Check if there's any activity this month
      const hasActivity = reading || invoice || totalPayment > 0;

      // Only add to monthlyData if there's activity
      if (hasActivity) {
        const monthlyCharge = invoice ? invoice.total_amount : 0;
        const meterValue = reading ? reading.current_value : '-';
        const usage = reading ? reading.usage_amount : 0;
        const monthlyDebt = monthlyCharge - totalPayment;

        // Determine status - prioritize invoice.status from database
        let status;

        if (invoice && invoice.status) {
          // Use status from database (Paid, Unpaid, Cancelled)
          status = invoice.status === 'Paid' ? 'Lunas' :
            invoice.status === 'Unpaid' ? 'Hutang' :
              invoice.status;
        } else if (monthlyCharge === 0 && totalPayment === 0) {
          // Only meter reading exists, no invoice and no payment yet
          status = '-';
        } else if (monthlyCharge === 0 && totalPayment > 0) {
          // No invoice but there's payment (advance payment or overpayment)
          status = 'Lunas';
        } else if (totalPayment >= monthlyCharge) {
          // Payment covers the charge (fully paid)
          status = 'Lunas';
        } else {
          // Payment is less than charge (underpaid or not paid)
          status = 'Hutang';
        }

        monthlyData.push({
          monthYear,
          meterValue,
          usage,
          monthlyCharge,
          totalPayment,
          monthlyDebt: Math.max(0, monthlyDebt),
          status
        });
      }
    }

    // Reverse to show most recent first
    return monthlyData.reverse();
  };

  const monthlyData = buildMonthlyData();

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/customers')}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Kembali ke Daftar Pelanggan
      </button>

      <PageHeader title={customer.name} />

      {/* Combined Customer Info & Balance Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        {/* Balance Header with Gradient */}
        <div className="bg-linear-to-br from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Saldo Akun Pelanggan</p>
              <h2 className="text-4xl font-bold mb-2">{balance >= 0 ? '+' : ''}{formatCurrency(Math.abs(balance))}</h2>
              <p className={`text-sm font-medium ${ balance >= 0 ? 'text-green-200' : 'text-red-200' }`}>
                {balance >= 0 ? '✓ Surplus' : '⚠ Hutang'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTopUpModal(true)}
                className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
              >
                💳 Top Up Saldo
              </button>
              <button
                onClick={() => setShowAdjustmentModal(true)}
                className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-400 transition-colors shadow-md"
              >
                ⚙️ Penyesuaian
              </button>
            </div>
          </div>
        </div>

        {/* Customer Information Grid */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Informasi Pelanggan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-800 font-medium">{customer.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Telepon</p>
              <p className="text-sm text-gray-800 font-medium">{customer.phone || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Nomor Meteran</p>
              <p className="text-sm text-gray-800 font-medium">{customer.meter_number || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">RT/RW</p>
              <p className="text-sm text-gray-800 font-medium">RT {customer.rt || '-'} / RW {customer.rw || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Kota</p>
              <p className="text-sm text-gray-800 font-medium">{customer.city || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${ customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {customer.status === 'active' ? '✓ Aktif' : customer.status}
              </span>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Alamat</p>
              <p className="text-sm text-gray-800 font-medium">{customer.address || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Riwayat Tagihan</h3>
            <p className="text-sm text-gray-600 mt-1">
              {monthlyData.length > 0 ? `${ monthlyData.length } bulan dengan aktivitas` : 'Belum ada riwayat tagihan'}
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="year-filter" className="text-sm font-medium text-gray-700">Tahun:</label>
              <select
                id="year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowMeterModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              📊 Catat Meteran Baru
            </button>
          </div>
        </div>

        {monthlyData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">Tidak ada riwayat tagihan untuk tahun {selectedYear}</p>
            <p className="text-sm text-gray-400">Pilih tahun lain atau tambahkan pencatatan meteran baru</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Bulan</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Nilai Meteran</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Penggunaan</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Tagihan</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Pembayaran</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Hutang</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, idx) => (
                  <tr key={`billing-${ idx }`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{data.monthYear}</td>
                    <td className="py-3 px-4 text-center text-sm">
                      {typeof data.meterValue === 'number' ? (
                        <span className="font-semibold text-blue-600">{data.meterValue} m³</span>
                      ) : (
                        <span className="text-gray-400">{data.meterValue}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {data.usage > 0 ? (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          +{data.usage.toFixed(1)} m³
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-700">{formatCurrency(data.monthlyCharge)}</td>
                    <td className="py-3 px-4 text-right text-sm text-gray-700">{formatCurrency(data.totalPayment)}</td>
                    <td className={`py-3 px-4 text-right text-sm font-semibold ${ data.monthlyDebt > 0 ? 'text-red-600' : 'text-green-600' }`}>
                      {data.monthlyDebt > 0 ? '-' : ''}{formatCurrency(data.monthlyDebt)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${ data.status === 'Lunas' ? 'bg-green-100 text-green-800' :
                        data.status === 'Hutang' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                        {data.status === 'Lunas' ? '✓ Lunas' :
                          data.status === 'Hutang' ? '⚠️ Hutang' :
                            data.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Riwayat Transaksi</h3>
            <p className="text-sm text-gray-600 mt-1">
              {transactions.length > 0 ? `${ transactions.length } transaksi` : 'Belum ada transaksi'}
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">Belum ada riwayat transaksi</p>
            <p className="text-sm text-gray-400">Transaksi top-up dan pembayaran akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions
              .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
              .map((transaction, idx) => {
                const isTopUp = transaction.type === 'IN';
                const date = new Date(transaction.transaction_date);
                const formattedDate = date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={transaction.id || idx}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ isTopUp ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                        {isTopUp ? (
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        )}
                      </div>

                      {/* Transaction Details */}
                      <div>
                        <p className="font-semibold text-gray-800">
                          {isTopUp ? '💳 Top Up Saldo' : '💰 Pembayaran'}
                        </p>
                        <p className="text-sm text-gray-600">{transaction.category || (isTopUp ? 'Top Up' : 'Pembayaran Tagihan')}</p>
                        <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
                        {transaction.description && (
                          <p className="text-xs text-gray-500 italic mt-1">{transaction.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className={`text-lg font-bold ${ isTopUp ? 'text-green-600' : 'text-blue-600'
                        }`}>
                        {isTopUp ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${ isTopUp ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {isTopUp ? 'Masuk' : 'Keluar'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">💳 Top Up Saldo</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="topup-amount" className="block text-sm font-medium text-gray-700 mb-2">Jumlah Top Up</label>
                <input
                  id="topup-amount"
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Masukkan jumlah (dalam Rupiah)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTopUpModal(false);
                  setTopUpAmount('');
                }}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleTopUp}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Memproses...' : 'Proses'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Penyesuaian Saldo</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="adjustment-type" className="block text-sm font-medium text-gray-700 mb-2">Tipe Penyesuaian</label>
                <select
                  id="adjustment-type"
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="add">Tambah Saldo</option>
                  <option value="deduct">Kurangi Saldo</option>
                </select>
              </div>
              <div>
                <label htmlFor="adjustment-amount" className="block text-sm font-medium text-gray-700 mb-2">Jumlah Penyesuaian</label>
                <input
                  id="adjustment-amount"
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  placeholder="Masukkan jumlah (dalam Rupiah)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAdjustmentModal(false);
                  setAdjustmentAmount('');
                  setAdjustmentType('add');
                }}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleAdjustment}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Memproses...' : 'Proses'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meter Reading Modal */}
      <MeterReadingModal
        isOpen={showMeterModal}
        onClose={() => setShowMeterModal(false)}
        customerId={customer.id}
        customerName={customer.name}
        previousReading={meterReadings.length > 0 ? meterReadings[0] : null}
        onSubmit={handleMeterReading}
      />
    </div>
  );
}
