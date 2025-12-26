import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customers, meterReadings, transactions } from '../data/dummyData';
import { PageHeader, MeterReadingModal } from '../components';
import {
  formatCurrency,
  getCustomerMeterReadings,
  getLatestMeterReading,
  calculateUsage,
  formatDate,
  calculateMonthlyBilling
} from '../utils';

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const customer = customers.find(c => c.id === parseInt(customerId));
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showMeterModal, setShowMeterModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('add');

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

  const balance = customer.saldo;

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/customers')}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Kembali ke Daftar Pelanggan
      </button>

      <PageHeader
        title={customer.name}
        description={`${customer.city}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Balance Card */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
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

          {/* Deposit & Billing Status */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Pembayaran</h3>
            <div className="space-y-4">
              {/* Deposit Status */}
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Deposit/Setoran</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(Math.abs(balance))}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    balance >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {balance >= 0 ? '✓ Lunas' : 'Belum Lunas'}
                  </span>
                </div>
              </div>

              {/* Debt & Current Month Billing (if utang) */}
              {balance < 0 && (
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                  <p className="text-sm font-medium text-gray-600 mb-3">Rincian Hutang</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Total Hutang:</span>
                      <span className="text-sm font-bold text-red-600">{formatCurrency(Math.abs(balance))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Tagihan Bulan Ini:</span>
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(calculateMonthlyBilling(customer.wellSize))}</span>
                    </div>
                    <div className="pt-2 border-t border-red-200">
                      <p className="text-xs text-red-600 font-medium">
                        ⚠️ Pelanggan memiliki tunggakan. Mohon melakukan pembayaran segera.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Paid Status */}
              {balance >= 0 && (
                <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                  <p className="text-sm font-medium text-gray-600 mb-2">Tagihan Bulan Ini</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(calculateMonthlyBilling(customer.wellSize))}</p>
                  <p className="text-xs text-green-600 mt-2">✓ Semua pembayaran terbayar dengan baik</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pelanggan</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-700">{customer.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Telepon</p>
              <p className="text-sm text-gray-700">{customer.phone}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Lokasi</p>
              <p className="text-sm text-gray-700">{customer.city}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Alamat</p>
              <p className="text-sm text-gray-700">{customer.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Billing History */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Tagihan Bulanan</h3>
        
        {(() => {
          // Get billing data for the past 12 months (to show debt history)
          const currentDate = new Date();
          const monthlyData = [];
          let cumulativeDebt = 0;
          
          // Calculate billing for last 12 months
          for (let i = 11; i >= 0; i--) {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthYear = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            const monthKey = monthDate.toLocaleDateString('id-ID', { month: '2-digit', year: 'numeric' });
            
            // Get payments for this month from transactions
            const monthPayments = transactions.filter(t => {
              const tDate = new Date(t.date);
              return tDate.getMonth() === monthDate.getMonth() && 
                     tDate.getFullYear() === monthDate.getFullYear() &&
                     t.type === 'IN' &&
                     t.customer_name === customer.name;
            });
            
            const totalPayment = monthPayments.reduce((sum, t) => sum + t.amount, 0);
            const monthlyCharge = calculateMonthlyBilling(customer.wellSize);
            const monthlyDebt = monthlyCharge - totalPayment;
            
            // Accumulate debt from previous months
            cumulativeDebt += monthlyDebt;
            
            monthlyData.push({
              monthYear,
              monthKey,
              monthlyCharge,
              totalPayment,
              monthlyDebt: Math.max(0, monthlyDebt),
              cumulativeDebt: Math.max(0, cumulativeDebt)
            });
          }

          return (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Bulan</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Tagihan</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Pembayaran</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Hutang Bulan Ini</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Total Hutang</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((data, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">{data.monthYear}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-700">{formatCurrency(data.monthlyCharge)}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-700">{formatCurrency(data.totalPayment)}</td>
                      <td className={`py-3 px-4 text-right text-sm font-semibold ${data.monthlyDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {data.monthlyDebt > 0 ? '-' : ''}{formatCurrency(data.monthlyDebt)}
                      </td>
                      <td className={`py-3 px-4 text-right text-sm font-semibold ${data.cumulativeDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {data.cumulativeDebt > 0 ? '-' : ''}{formatCurrency(data.cumulativeDebt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          data.monthlyDebt > 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {data.monthlyDebt > 0 ? '⚠️ Hutang' : '✓ Lunas'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      {/* Meter Reading History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Riwayat Pencatatan Meteran</h3>
          <button
            onClick={() => setShowMeterModal(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 Catat Meteran Baru
          </button>
        </div>

        {(() => {
          const customerReadings = getCustomerMeterReadings(customer.id, meterReadings);

          if (customerReadings.length === 0) {
            return (
              <div className="text-center py-12">
                <p className="text-gray-500">Belum ada pencatatan meteran</p>
              </div>
            );
          }

          return (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Tanggal</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Nilai Meteran</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Penggunaan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Dicatat Oleh</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Catatan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Total Biaya</th>
                  </tr>
                </thead>
                <tbody>
                  {customerReadings.map((reading, index) => {
                    const previousReading = customerReadings[index + 1];
                    const usage = calculateUsage(reading, previousReading);

                    return (
                      <tr key={reading.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {formatDate(reading.readingDate)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-blue-600">{reading.meterValue} m³</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {usage > 0 ? (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                              +{usage.toFixed(1)} m³
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {reading.recordedBy}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {reading.notes}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatCurrency(reading.totalCost)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">💳 Top Up Saldo</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Top Up</label>
                <input
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert(`Top up sebesar ${ topUpAmount ? formatCurrency(parseInt(topUpAmount)) : '0' } berhasil diproses!`);
                  setShowTopUpModal(false);
                  setTopUpAmount('');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Proses
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Penyesuaian</label>
                <select
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="add">Tambah Saldo</option>
                  <option value="deduct">Kurangi Saldo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                <input
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  const action = adjustmentType === 'add' ? 'Penambahan' : 'Pengurangan';
                  alert(`${ action } saldo sebesar ${ adjustmentAmount ? formatCurrency(parseInt(adjustmentAmount)) : '0' } berhasil diproses!`);
                  setShowAdjustmentModal(false);
                  setAdjustmentAmount('');
                  setAdjustmentType('add');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Proses
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
        previousReading={getLatestMeterReading(customer.id, meterReadings)}
        onSubmit={(newReading) => {
          console.log('New meter reading:', newReading);
          alert(`Pencatatan meteran untuk ${ customer.name } berhasil disimpan!`);
          setShowMeterModal(false);
        }}
      />
    </div>
  );
}
