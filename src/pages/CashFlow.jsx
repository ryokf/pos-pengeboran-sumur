import { PageHeader } from '../components';
import { formatCurrency } from '../utils';
import { dummyData } from '../data/dummyData';

export default function CashFlow() {
  // Use centralized transaction data
  const transactions = dummyData.transactions;

  const totalIn = transactions
    .filter(t => t.type === 'IN')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter(t => t.type === 'OUT')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIn - totalOut;

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
