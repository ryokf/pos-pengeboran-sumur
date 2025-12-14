import { dashboardStats, customers, orders, inventory } from '../data/dummyData';
import { StatCard, PageHeader } from '../components';
import { formatCurrency } from '../utils';

export default function Dashboard() {
  // Calculate dashboard metrics
  const totalCustomerBalance = customers.reduce((acc, c) => acc + c.saldo, 0);
  const drillingProjects = orders.filter(o => o.status === 'Drilling').length;
  const overdueDebts = customers.reduce((acc, c) => acc + (c.saldo < 0 ? Math.abs(c.saldo) : 0), 0);

  // Get top debtors (5 customers with negative balance)
  const topDebtors = [...customers]
    .filter(c => c.saldo < 0)
    .sort((a, b) => a.saldo - b.saldo)
    .slice(0, 5);

  // Get low stock items (5 items with stock below minimum)
  const lowStockItems = [...inventory]
    .filter(item => item.stock < item.minStock)
    .sort((a, b) => (a.stock / a.minStock) - (b.stock / b.minStock))
    .slice(0, 5);

  return (
    <div className="p-8">
      <PageHeader
        title="Dasbor"
        description="Ringkasan kondisi bisnis Pengeboran Sumur"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Saldo Pelanggan"
          value={formatCurrency(totalCustomerBalance)}
          icon="💰"
          subtext="Deposit - Hutang"
        />
        <StatCard
          title="Uang Kas Kantor"
          value={formatCurrency(dashboardStats.cashOnHand)}
          icon="💵"
          subtext="Real Cash"
        />
        <StatCard
          title="Proyek Aktif"
          value={drillingProjects}
          icon="⛏️"
          subtext="Status Pengeboran"
        />
        <StatCard
          title="Piutang Macet"
          value={formatCurrency(overdueDebts)}
          icon="⚠️"
          subtext="Saldo Negatif"
        />
      </div>

      {/* Income vs Expense Chart & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pemasukan vs Pengeluaran (Bulan Ini)</h2>
          <div className="h-64 flex items-end gap-4 relative">
            {dashboardStats.monthlyIncome.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center relative group">
                <div className="w-full flex gap-1 items-end justify-center mb-2" style={{ height: '200px' }}>
                  {/* Income Bar */}
                  <div
                    className="flex-1 bg-green-500 rounded-t-lg transition-all hover:bg-green-600 cursor-pointer relative"
                    style={{ height: `${ (data.income / 10000000) * 100 }%` }}
                  >
                    {/* Tooltip for Income */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      <div className="font-semibold">Pemasukan {data.month}</div>
                      <div>{formatCurrency(data.income)}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  {/* Expense Bar */}
                  <div
                    className="flex-1 bg-red-500 rounded-t-lg transition-all hover:bg-red-600 cursor-pointer relative"
                    style={{ height: `${ (data.expense / 10000000) * 100 }%` }}
                  >
                    {/* Tooltip for Expense */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      <div className="font-semibold">Pengeluaran {data.month}</div>
                      <div>{formatCurrency(data.expense)}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-700">Pemasukan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Pengeluaran</span>
            </div>
          </div>
        </div>


        {/* Piutang Terbesar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">5 Piutang Terbesar</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {topDebtors.length > 0 ? (
              topDebtors.map((debtor, idx) => (
                <div key={debtor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{idx + 1}. {debtor.name}</p>
                    <p className="text-xs text-gray-600">{debtor.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-red-600">{formatCurrency(Math.abs(debtor.saldo))}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-2">✓</p>
                <p className="text-sm">Tidak ada piutang</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Items */}
      {/* <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">5 Stok Barang Menipis</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Barang</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Stok</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Min. Stok</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Nilai Stok</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => {
                  const stockPercentage = (item.stock / item.minStock) * 100;
                  const badgeColor = stockPercentage < 30 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700';
                  
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{item.name}</td>
                      <td className="text-center py-3 px-4">
                        <span className="font-semibold">{item.stock} {item.unit}</span>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">{item.minStock}</td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                          {stockPercentage.toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 font-semibold text-gray-800">
                        {formatCurrency(item.stock * item.price)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    Semua stok dalam kondisi baik ✓
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
