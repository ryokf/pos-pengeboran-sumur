import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils';
import { getCustomers, getCustomerTransactions } from '../services/customerService';
import { getInvoices, getAppSettings, getPricingTiers } from '../services/billingService';

export default function Billing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [appSettings, setAppSettings] = useState(null);
  const [pricingTiers, setPricingTiers] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [customersData, invoicesData, settingsData, tiersData] = await Promise.all([
          getCustomers(),
          getInvoices(),
          getAppSettings(),
          getPricingTiers()
        ]);

        setCustomers(customersData);
        setInvoices(invoicesData);
        setAppSettings(settingsData);
        setPricingTiers(tiersData);

        // Fetch all transactions for all customers
        const allTransactions = [];
        for (const customer of customersData) {
          try {
            const customerTransactions = await getCustomerTransactions(customer.id);
            allTransactions.push(...customerTransactions);
          } catch (err) {
            console.error(`Error fetching transactions for customer ${ customer.id }:`, err);
          }
        }
        setTransactions(allTransactions);

      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Gagal memuat data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to calculate remaining amount after payments
  const calculateRemainingAmount = (invoice) => {
    // Find all payment transactions for this invoice
    const invoicePayments = transactions.filter(
      t => t.invoice_id === invoice.id && t.type === 'OUT'
    );

    // Sum up all payments
    const totalPayments = invoicePayments.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Return remaining amount
    return Math.max(0, invoice.total_amount - totalPayments);
  };

  // Get all unpaid or partially paid invoices (invoices with remaining balance)
  const getUnpaidInvoices = () => {
    return invoices.filter(inv => {
      const remaining = calculateRemainingAmount(inv);
      return remaining > 0; // Include any invoice with remaining balance
    });
  };

  // Count active customers (customers with status active)
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  // Calculate total billing potential from all unpaid invoices (remaining amounts)
  const unpaidInvoices = getUnpaidInvoices();
  const totalBillingPotential = unpaidInvoices.reduce((sum, inv) => sum + calculateRemainingAmount(inv), 0);

  const handlePrintBillingList = () => {
    navigate('/finance/billing/print');
  };

  const handlePrintSummary = () => {
    navigate('/finance/billing/summary');
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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tagihan Bulanan</h1>
        <p className="text-gray-600">Kelola tagihan pelanggan berlangganan</p>
      </div>

      {/* Info Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Customers Card */}
        <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-6">
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
        <div className="bg-linear-to-br from-green-50 to-green-100 border border-green-300 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Total Tagihan</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totalBillingPotential)}
              </p>
              <p className="text-xs text-green-600 mt-2">belum lunas</p>
            </div>
            <div className="text-5xl">💰</div>
          </div>
        </div>

        {/* Total Invoices Card */}
        <div className="bg-linear-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">Tagihan Belum Lunas</p>
              <p className="text-3xl font-bold text-purple-900">{unpaidInvoices.length}</p>
              <p className="text-xs text-purple-600 mt-2">invoice tertunda</p>
            </div>
            <div className="text-5xl">📋</div>
          </div>
        </div>

        {/* Total All Invoices Card */}
        <div className="bg-linear-to-br from-orange-50 to-orange-100 border border-orange-300 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium mb-1">Total Invoice</p>
              <p className="text-3xl font-bold text-orange-900">{invoices.length}</p>
              <p className="text-xs text-orange-600 mt-2">semua tagihan</p>
            </div>
            <div className="text-5xl">📊</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Main Action Card */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center lg:col-span-2">
          <div className="mb-6">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Laporan Tagihan</h2>
            <p className="text-gray-600">
              Cetak daftar tagihan atau rekap resi untuk pelanggan bulan ini.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePrintBillingList}
              className="text-lg font-bold py-4 px-12 rounded-lg transition-all duration-300 bg-linear-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🖨️ Cetak Daftar Tagihan
            </button>

            <button
              onClick={handlePrintSummary}
              className="text-lg font-bold py-4 px-12 rounded-lg transition-all duration-300 bg-linear-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📊 Cetak Rekap Resi
            </button>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">💰 Informasi Tarif</h3>
          <div className="space-y-2 text-sm text-blue-800">
            {pricingTiers.map((tier, index) => (
              <div key={tier.id} className="flex items-start">
                <span className="font-bold mr-2">{index + 1}.</span>
                <span>
                  {tier.name}: {tier.min_usage}-{tier.max_usage || '∞'} m³ =
                  Rp {tier.price_per_m3.toLocaleString('id-ID')}/m³
                </span>
              </div>
            ))}
            {appSettings && (
              <div className="flex items-start pt-2 border-t border-blue-200">
                <span className="font-bold mr-2">•</span>
                <span>
                  Biaya Admin: Rp {appSettings.admin_fee.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-3">⚠️ Catatan Penting</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Tagihan dibuat berdasarkan pembacaan meteran bulanan</li>
            <li>• Tarif dihitung berdasarkan penggunaan air (m³)</li>
            <li>• Biaya admin ditambahkan ke setiap tagihan</li>
            <li>• Pelanggan dapat melihat detail tagihan di halaman detail mereka</li>
          </ul>
        </div>
      </div>

      {/* Unpaid Invoices - Full Width */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          📋 Tagihan Belum Lunas ({unpaidInvoices.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unpaidInvoices.length > 0 ? (
            unpaidInvoices.map(invoice => {
              const remainingAmount = calculateRemainingAmount(invoice);
              const totalPayments = transactions
                .filter(t => t.invoice_id === invoice.id && t.type === 'OUT')
                .reduce((sum, t) => sum + (t.amount || 0), 0);
              const isPartiallyPaid = totalPayments > 0 && remainingAmount > 0;

              return (
                <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        {invoice.customers?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {invoice.invoice_number || '-'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {invoice.period}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${ invoice.status === 'Paid' || remainingAmount === 0 ? 'bg-green-100 text-green-800' :
                        isPartiallyPaid ? 'bg-orange-100 text-orange-800' :
                          invoice.status === 'Unpaid' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {invoice.status === 'Paid' || remainingAmount === 0 ? '✓ Lunas' :
                        isPartiallyPaid ? '◐ Sebagian' :
                          invoice.status === 'Unpaid' ? '⚠ Belum' :
                            invoice.status}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(remainingAmount)}
                    </p>
                    <p className="text-xs text-gray-500">Sisa tagihan</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <p className="text-center text-gray-500 py-8">
                ✓ Semua tagihan sudah lunas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
