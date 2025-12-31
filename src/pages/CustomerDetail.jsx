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
  addMeterReading
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
      await addTopUp(customerId, Number.parseFloat(topUpAmount));

      // Refresh customer data
      const updatedCustomer = await getCustomerById(customerId);
      setCustomer(updatedCustomer);

      alert(`Top up sebesar ${ formatCurrency(Number.parseFloat(topUpAmount)) } berhasil diproses!`);
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

  // Handle meter reading submission
  const handleMeterReading = async (newReading) => {
    try {
      setSubmitting(true);

      // Get the latest reading for previous value
      const latestReading = meterReadings.length > 0 ? meterReadings[0] : null;
      const previousValue = latestReading ? latestReading.current_value : 0;

      // Get current month and year
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      await addMeterReading(
        customerId,
        newReading.meterValue,
        currentMonth,
        currentYear,
        previousValue,
        newReading.notes || ''
      );

      // Refresh meter readings
      const updatedReadings = await getCustomerMeterReadings(customerId);
      setMeterReadings(updatedReadings);

      alert(`Pencatatan meteran untuk ${ customer.name } berhasil disimpan!`);
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

  // Build monthly billing data
  const buildMonthlyData = () => {
    const currentDate = new Date();
    const monthlyData = [];

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = monthDate.getMonth() + 1;
      const year = monthDate.getFullYear();
      const monthYear = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

      // Find meter reading for this month
      const reading = meterReadings.find(r => r.period_month === month && r.period_year === year);

      // Find invoice for this month
      const invoice = invoices.find(inv => {
        const invDate = new Date(inv.created_at);
        return invDate.getMonth() + 1 === month && invDate.getFullYear() === year;
      });

      // Find payments for this month
      const monthPayments = transactions.filter(t => {
        const tDate = new Date(t.transaction_date);
        return tDate.getMonth() + 1 === month && tDate.getFullYear() === year;
      });

      const totalPayment = monthPayments.reduce((sum, t) => sum + (t.amount || 0), 0);
      const monthlyCharge = invoice ? invoice.total_amount : 0;
      const meterValue = reading ? reading.current_value : '-';
      const usage = reading ? reading.usage_amount : 0;
      const monthlyDebt = monthlyCharge - totalPayment;

      // Determine status based on payment vs charge comparison
      // Status logic:
      // - Lunas: if there's a charge and payment >= charge (fully paid)
      // - Hutang: if there's a charge and payment < charge (underpaid or not paid)
      // - '-': only if there's no activity at all (no reading, no invoice, no payment)
      let status;

      // Check if there's any activity this month
      const hasActivity = reading || invoice || totalPayment > 0;

      if (!hasActivity) {
        // No activity at all this month
        status = '-';
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

    return monthlyData;
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Balance Card */}
        <div className="lg:col-span-2">
          <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
            <div className="mb-8">
              <p className="text-blue-100 text-sm font-medium mb-2">Saldo Akun Pelanggan</p>
              <h2 className="text-4xl font-bold mb-2">{balance >= 0 ? '+' : ''}{formatCurrency(Math.abs(balance))}</h2>
              <p className={`text-sm font-medium ${ balance >= 0 ? 'text-green-200' : 'text-red-200' }`}>
                {balance >= 0 ? '✓ Surplus' : '⚠ Hutang'}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowTopUpModal(true)}
                className="flex-1 bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
              >
                💳 Top Up Saldo
              </button>
              <button
                onClick={() => setShowAdjustmentModal(true)}
                className="flex-1 bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-400 transition-colors"
              >
                ⚙️ Penyesuaian
              </button>
            </div>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pelanggan</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-700">{customer.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Telepon</p>
              <p className="text-sm text-gray-700">{customer.phone || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">RT/RW</p>
              <p className="text-sm text-gray-700">RT {customer.rt || '-'} / RW {customer.rw || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Kota</p>
              <p className="text-sm text-gray-700">{customer.city || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Alamat</p>
              <p className="text-sm text-gray-700">{customer.address || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Nomor Meteran</p>
              <p className="text-sm text-gray-700">{customer.meter_number || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${ customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {customer.status === 'active' ? '✓ Aktif' : customer.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Riwayat Tagihan</h3>
          <button
            onClick={() => setShowMeterModal(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 Catat Meteran Baru
          </button>
        </div>

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
