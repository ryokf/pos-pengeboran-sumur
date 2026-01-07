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
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tagihan Bulanan</h1>
          <p className="text-gray-600">Kelola tagihan pelanggan berlangganan</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-6 mb-12">
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
        </div>

        {/* Main Action Card */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
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

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 gap-6">
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

          {/* Unpaid Invoices */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📋 Tagihan Belum Lunas ({unpaidInvoices.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {unpaidInvoices.length > 0 ? (
                unpaidInvoices.map(invoice => {
                  const remainingAmount = calculateRemainingAmount(invoice);
                  const totalPayments = transactions
                    .filter(t => t.invoice_id === invoice.id && t.type === 'OUT')
                    .reduce((sum, t) => sum + (t.amount || 0), 0);
                  const isPartiallyPaid = totalPayments > 0 && remainingAmount > 0;

                  return (
                    <div key={invoice.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">
                          {invoice.customers?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {invoice.invoice_number || '-'} • {invoice.period}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">
                          {formatCurrency(remainingAmount)}
                        </p>
                        <p className={`text-xs ${ invoice.status === 'Paid' || remainingAmount === 0 ? 'text-green-600' :
                          isPartiallyPaid ? 'text-orange-600' :
                            invoice.status === 'Unpaid' ? 'text-red-600' :
                              'text-gray-500'
                          }`}>
                          {invoice.status === 'Paid' || remainingAmount === 0 ? '✓ Lunas' :
                            isPartiallyPaid ? '◐ Sebagian' :
                              invoice.status === 'Unpaid' ? '⚠ Belum Bayar' :
                                invoice.status}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Semua tagihan sudah lunas
                </p>
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
      </div>
    </div>
  );
}
