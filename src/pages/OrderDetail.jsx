import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orders } from '../data/dummyData';
import { PageHeader, StatusBadge } from '../components';
import { getStatusColor, formatCurrency } from '../utils';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === orderId);
  const [activeTab, setActiveTab] = useState('info');

  if (!order) {
    return (
      <div className="p-8">
        <PageHeader title="Order Not Found" />
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/orders')}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Kembali ke Daftar Order
      </button>

      <PageHeader
        title={order.projectName}
        description={`Order: ${order.id}`}
      />

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Status Proyek</p>
            <StatusBadge 
              status={order.status}
              colorClass={getStatusColor(order.status)}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Status Pembayaran</p>
            <StatusBadge 
              status={order.paymentStatus}
              colorClass={getStatusColor(order.paymentStatus)}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Nominal Proyek</p>
            <p className="font-semibold text-gray-800">{formatCurrency(order.amount)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Pelanggan</p>
            <p className="font-semibold text-gray-800">{order.customerName}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'info'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📋 Info Project
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'logs'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📊 Daily Logs
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Nama Proyek</h3>
                  <p className="text-lg font-semibold text-gray-800">{order.projectName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">ID Order</h3>
                  <p className="text-lg font-semibold text-gray-800">{order.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Pelanggan</h3>
                  <p className="text-lg font-semibold text-gray-800">{order.customerName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Nominal</h3>
                  <p className="text-lg font-semibold text-blue-600">{formatCurrency(order.amount)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tanggal Order</h3>
                  <p className="text-lg font-semibold text-gray-800">{order.orderDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tanggal Estimasi Selesai</h3>
                  <p className="text-lg font-semibold text-gray-800">{order.deliveryDate}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Catatan</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Tracking kedalaman sumur dan kondisi tanah harian</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Kedalaman (m)</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Kondisi Tanah</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td colSpan="4" className="py-8 px-4 text-center text-gray-500">
                        Belum ada data daily logs. Data akan ditambahkan saat pelaksanaan proyek dimulai.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Add Log Form Placeholder */}
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-4">Tambah Daily Log</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="date"
                    placeholder="Tanggal"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Kedalaman (m)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Pilih Kondisi Tanah</option>
                    <option value="clay">Lempung (Clay)</option>
                    <option value="sand">Pasir (Sand)</option>
                    <option value="rock">Batu (Rock)</option>
                    <option value="mixed">Campuran</option>
                  </select>
                </div>
                <textarea
                  placeholder="Catatan tambahan..."
                  rows="3"
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  Simpan Log
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
