import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyData } from '../data/dummyData';
import { calculateMonthlyBilling, PRICING_TIERS, formatCurrency } from '../utils/constants';

export default function Billing() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Count active customers (customers with positive balance)
  const activeCustomers = dummyData.customers.filter(c => c.saldo > 0).length;

  // Calculate total billing potential using tiered pricing
  const totalBillingPotential = dummyData.customers.reduce((sum, c) => {
    if (c.saldo > 0) {
      return sum + calculateMonthlyBilling(c.wellSize);
    }
    return sum;
  }, 0);

  const handleProcessBilling = async () => {
    setIsProcessing(true);

    // Simulate API call to backend
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSuccessMessage(
      `✓ Proses tagihan berhasil! ${ activeCustomers } pelanggan telah ditagih sebesar ${ formatCurrency(totalBillingPotential) }`
    );
    setIsProcessing(false);

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handlePrintBillingList = () => {
    navigate('/finance/billing/print');
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tagihan Bulanan</h1>
          <p className="text-gray-600">Kelola tagihan pelanggan berlangganan</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {/* Active Customers Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Pelanggan Aktif</p>
                <p className="text-3xl font-bold text-blue-900">{activeCustomers}</p>
                <p className="text-xs text-blue-600 mt-2">pelanggan berlangganan</p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </div>

          {/* Total Billing Potential Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Potensi Tagihan</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(totalBillingPotential)}
                </p>
                <p className="text-xs text-green-600 mt-2">bulan ini</p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>
        </div>

        {/* Main Action Card */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Proses Tagihan</h2>
            <p className="text-gray-600">
              Klik tombol di bawah untuk memproses tagihan bulanan kepada semua pelanggan aktif.
              Sistem akan secara otomatis membuat mutasi 'Debit' untuk setiap pelanggan.
            </p>
          </div>

          {/* Process Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleProcessBilling}
              disabled={isProcessing}
              className={`
                text-lg font-bold py-4 px-12 rounded-lg transition-all duration-300
                ${ isProcessing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                }
              `}
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Sedang memproses...
                </>
              ) : (
                '▶ Proses Tagihan Bulan Ini'
              )}
            </button>

            <button
              onClick={handlePrintBillingList}
              className="text-lg font-bold py-4 px-12 rounded-lg transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🖨️ Cetak Daftar Tagihan
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-8 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 gap-6">
          {/* How It Works */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">📌 Cara Kerja</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>Sistem menghitung biaya bulanan berdasarkan ukuran sumur dengan tarif berjenjang</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>Sumur &lt; 5 m³: Rp {PRICING_TIERS.SMALL_WELL_PRICE.toLocaleString('id-ID')}/m³</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>Sumur ≥ 5 m³: Rp {PRICING_TIERS.LARGE_WELL_PRICE.toLocaleString('id-ID')}/m³</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span>Membuat transaksi 'Debit' otomatis untuk setiap pelanggan aktif</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">5.</span>
                <span>Notifikasi akan dikirim kepada pelanggan tentang tagihan baru</span>
              </li>
            </ul>
          </div>

          {/* Active Customers List */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Pelanggan yang Akan Ditagih</h3>
            <div className="space-y-2">
              {dummyData.customers
                .filter(c => c.saldo > 0)
                .map(customer => {
                  const monthlyCharge = calculateMonthlyBilling(customer.wellSize);
                  const pricePerM3 = customer.wellSize < PRICING_TIERS.SMALL_WELL_THRESHOLD
                    ? PRICING_TIERS.SMALL_WELL_PRICE
                    : PRICING_TIERS.LARGE_WELL_PRICE;

                  return (
                    <div key={customer.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">
                          {customer.wellSize} m³ × Rp {pricePerM3.toLocaleString('id-ID')}/m³
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">
                          {formatCurrency(monthlyCharge)}
                        </p>
                        <p className="text-xs text-gray-500">tagihan bulanan</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">⚠️ Catatan Penting</h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>• Proses ini tidak bisa dibatalkan setelah dimulai</li>
              <li>• Pastikan data pelanggan sudah benar sebelum memproses</li>
              <li>• Sistem akan mencatat waktu proses untuk keperluan audit</li>
              <li>• Backup data akan dibuat secara otomatis sebelum proses dimulai</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
