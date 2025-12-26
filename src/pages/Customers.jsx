import { customers, wells } from '../data/dummyData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterBar, PageHeader, EmptyState } from '../components';
import { matchesSearch, formatCurrency, getInitials } from '../utils';

export default function Customers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRT, setSelectedRT] = useState('All');

  // Get unique RT values from customers
  const rtOptions = ['All', ...new Set(customers.map(c => c.rt))].sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return a.localeCompare(b);
  });

  // Filter customers based on search term and RT
  const filteredCustomers = customers.filter(customer => {
    const matchesSearchTerm = matchesSearch(searchTerm, customer.name, customer.email, customer.phone);
    const matchesRT = selectedRT === 'All' || customer.rt === selectedRT;
    return matchesSearchTerm && matchesRT;
  });

  // Get well name by ID
  const getWellName = (wellId) => {
    const well = wells.find(w => w.id === wellId);
    return well ? well.name : 'N/A';
  };

  // Get customer balance
  const getCustomerBalance = (customer) => {
    return customer.saldo;
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Pelanggan"
        description="Kelola informasi dan hubungan pelanggan"
      />

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari berdasarkan nama, email, atau telepon..."
        filterLabel="Tipe"
        filterValue="All"
        onFilterChange={() => {}}
        filterOptions={[]}
        onAddNew={() => alert('Form pelanggan baru akan dibuka')}
        addButtonLabel="+ Pelanggan Baru"
      />

      {/* RT Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="rt-filter" className="text-sm font-semibold text-gray-700">Filter RT:</label>
          <select
            id="rt-filter"
            value={selectedRT}
            onChange={(e) => setSelectedRT(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            {rtOptions.map(rt => (
              <option key={rt} value={rt}>
                {rt === 'All' ? 'Semua RT' : `RT ${rt}`}
              </option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-600">
          ({filteredCustomers.length} pelanggan)
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama Pelanggan</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Telepon</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">RT</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Alamat</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Sumur yang digunakan</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Total Penggunaan Air</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Saldo</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const balance = getCustomerBalance(customer);
                const balanceColor = balance >= 0 ? 'text-green-600' : 'text-red-600';

                return (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(customer.name)}
                        </div>
                        <p className="font-medium text-gray-800">{customer.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{customer.phone}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        RT {customer.rt}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{customer.address}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 text-center">{getWellName(customer.wellId)}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-700">
                      <span className="font-medium">{customer.wellSize}</span> m³
                    </td>
                    <td className={`py-4 px-6 text-right font-bold text-lg ${ balanceColor }`}>
                      {balance >= 0 ? '+' : '-'}{formatCurrency(Math.abs(balance))}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => navigate(`/customers/${ customer.id }`)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => navigate(`/customers/${ customer.id }`)}
                        className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <EmptyState message="Tidak ada pelanggan ditemukan" />
      )}
    </div>
  );
}
