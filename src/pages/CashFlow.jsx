import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components';
import { formatCurrency } from '../utils';

export default function CashFlow() {
  const navigate = useNavigate();
  const [transactions] = useState([
    {
      id: 1,
      date: '2025-12-07',
      category: 'Pembayaran Bulanan',
      type: 'IN',
      amount: 5000000,
      description: 'Pembayaran oleh pelanggan 1',
      is_receipt_printed: 0,
      customer_name: 'Pelanggan 1'
    },
    {
      id: 2,
      date: '2025-12-06',
      category: 'Gaji Karyawan',
      type: 'OUT',
      amount: 8000000,
      description: 'Pembayaran gaji bulan Desember',
      is_receipt_printed: 0,
      customer_name: 'Internal'
    },
    {
      id: 3,
      date: '2025-12-05',
      category: 'Pembayaran Bulanan',
      type: 'IN',
      amount: 3500000,
      description: 'Pembayaran oleh pelanggan 2',
      is_receipt_printed: 1,
      customer_name: 'Pelanggan 2'
    },
    {
      id: 4,
      date: '2025-12-04',
      category: 'Dana Hibah',
      type: 'OUT',
      amount: 2500000,
      description: 'Pembayaran dana hibah',
      is_receipt_printed: 0,
      customer_name: 'Pelanggan 3'
    },
    {
      id: 5,
      date: '2025-12-03',
      category: 'Pembayaran Bulanan',
      type: 'IN',
      amount: 10500000,
      description: 'Pembayaran oleh pelanggan 5',
      is_receipt_printed: 0,
      customer_name: 'Pelanggan 5'
    },
    {
      id: 6,
      date: '2025-12-02',
      category: 'Pembayaran Bulanan',
      type: 'OUT',
      amount: 1500000,
      description: 'Pembayaran oleh pelanggan 4',
      is_receipt_printed: 0,
      customer_name: 'Pelanggan 4'
    }
  ]);

  const totalIn = transactions
    .filter(t => t.type === 'IN')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter(t => t.type === 'OUT')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIn - totalOut;

  const handlePrintReceipt = (transaction) => {
    if (transaction.is_receipt_printed === 0) {
      navigate(`/finance/receipt/${ transaction.id }/print`);
    }
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Arus Kas Kantor"
        description="Kelola transaksi uang fisik kantor"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm font-medium text-green-700 mb-2">Total Pemasukan</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIn)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-sm font-medium text-red-700 mb-2">Total Pengeluaran</p>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalOut)}</p>
        </div>
        <div className={`${ balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200' } border rounded-lg p-6`}>
          <p className={`text-sm font-medium ${ balance >= 0 ? 'text-blue-700' : 'text-orange-700' } mb-2`}>
            Saldo Kas
          </p>
          <p className={`text-3xl font-bold ${ balance >= 0 ? 'text-blue-600' : 'text-orange-600' }`}>
            {balance >= 0 ? '+' : ''}{formatCurrency(Math.abs(balance))}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Tanggal</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Kategori</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Keterangan</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Sumber/Tujuan</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Nominal</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Tipe</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-600">{transaction.date}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-medium">{transaction.description}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{transaction.customer_name}</td>
                  <td className={`py-4 px-6 text-right font-bold ${ transaction.type === 'IN' ? 'text-green-600' : 'text-red-600' }`}>
                    {transaction.type === 'IN' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ transaction.type === 'IN'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}>
                      {transaction.type === 'IN' ? '📥 Masuk' : '📤 Keluar'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {transaction.type === 'IN' ? (
                      <button
                        onClick={() => handlePrintReceipt(transaction)}
                        disabled={transaction.is_receipt_printed === 1}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${ transaction.is_receipt_printed === 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                      >
                        {transaction.is_receipt_printed === 0 ? '🖨️ Cetak' : '✓ Sudah Dicetak'}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">Keterangan:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mr-2">📥 Masuk</span>
            Uang yang diterima dari pelanggan
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium mr-2">📤 Keluar</span>
            Uang yang dikeluarkan untuk operasional
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium mr-2">🖨️ Cetak</span>
            Tombol untuk mencetak resi pembayaran
          </div>
        </div>
      </div>
    </div>
  );
}
