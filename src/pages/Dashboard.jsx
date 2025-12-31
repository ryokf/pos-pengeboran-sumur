import { useState, useEffect } from 'react';
import { StatCard, PageHeader } from '../components';
import { formatCurrency } from '../utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardStats, updatePumpStatus } from '../services/dashboardService';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pumpStatus, setPumpStatus] = useState('Mati');
  const [updatingPump, setUpdatingPump] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getDashboardStats();
        setStats(dashboardData);
        setPumpStatus(dashboardData.pumpStatus);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('Gagal memuat data dashboard: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle pump status toggle
  const handleTogglePumpStatus = async () => {
    try {
      setUpdatingPump(true);
      const newStatus = pumpStatus === 'Hidup' ? 'Mati' : 'Hidup';

      await updatePumpStatus(newStatus);
      setPumpStatus(newStatus);
      alert(`Status pompa berhasil diubah menjadi ${ newStatus }`);

    } catch (error) {
      console.error('Error updating pump status:', error);
      alert('Gagal mengubah status pompa: ' + error.message);
    } finally {
      setUpdatingPump(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Gagal memuat data dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Dasbor"
        description="Ringkasan kondisi bisnis Sistem Kelola Tagihan Air"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Saldo Pelanggan"
          value={formatCurrency(stats.totalCustomerBalance)}
          icon="💰"
          subtext="Deposit - Hutang"
        />
        <StatCard
          title="Saldo Kas Masjid"
          value={formatCurrency(stats.masjidCashBalance)}
          icon="🕌"
          subtext="Operasional Air"
        />
        <StatCard
          title="Keluhan Masuk Hari Ini"
          value={stats.complaintsTodayCount}
          icon="⚠️"
          subtext="Laporan dari Warga"
        />
        <StatCard
          title="Total Pemakaian Air Bulan Ini"
          value={stats.totalWaterUsageThisMonth.toFixed(1) + " m³"}
          icon="🚰"
          subtext=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pemasukan vs Pengeluaran (6 Bulan Terakhir)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyIncome}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 5 }}
                activeDot={{ r: 7 }}
                name="Pemasukan"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 5 }}
                activeDot={{ r: 7 }}
                name="Pengeluaran"
              />
            </LineChart>
          </ResponsiveContainer>
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
            {stats.topDebtors.length > 0 ? (
              stats.topDebtors.map((debtor, idx) => (
                <div key={debtor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{idx + 1}. {debtor.name}</p>
                    <p className="text-xs text-gray-600">RT {debtor.rt}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-red-600">-{formatCurrency(Math.abs(debtor.current_balance))}</p>
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

      {/* Status Operasional Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">

        {/* Pump Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Pompa Masjid</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{pumpStatus === 'Hidup' ? '🟢' : '🔴'}</div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pumpStatus}</p>
              <p className="text-sm text-gray-600">
                {pumpStatus === 'Hidup' ? 'Pompa sedang beroperasi normal' : 'Pompa sedang berhenti'}
              </p>
            </div>
          </div>
          <button
            onClick={handleTogglePumpStatus}
            disabled={updatingPump}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updatingPump ? 'Mengubah...' : 'Ubah Status'}
          </button>
        </div>

        {/* Keluhan Masuk Hari Ini */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Keluhan Masuk Hari Ini</h3>
          {stats.complaints.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.complaints.map(complaint => (
                <div key={complaint.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">⚠️ {complaint.type}</p>
                      <p className="text-xs text-gray-600 mt-1">{complaint.resident}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{complaint.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-2xl mb-2">✓</p>
              <p className="text-sm">Tidak ada keluhan hari ini</p>
            </div>
          )}
          <button
            onClick={() => alert('Form laporan keluhan baru akan dibuka')}
            className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold text-sm"
          >
            Catat Keluhan Baru
          </button>
        </div>
      </div>
    </div>
  );
}
