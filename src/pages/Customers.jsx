import { customers, wells } from '../data/dummyData';
import { useDataFilter } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { FilterBar, PageHeader, EmptyState } from '../components';
import { FILTER_OPTIONS, matchesSearch, formatCurrency } from '../utils';

export default function Customers() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, filterValue, setFilterValue, filteredData: filteredCustomers } = useDataFilter(
    customers,
    {
      searchPredicate: (customer, term) =>
        matchesSearch(term, customer.name, customer.email, customer.phone),
      filterPredicate: (customer, type) =>
        type === 'All' || customer.type === type
    }
  );

  // Get customer balance
  const getCustomerBalance = (customer) => {
    return customer.saldo;
  };

  // Get well name by ID
  const getWellName = (wellId) => {
    const well = wells.find(w => w.id === wellId);
    return well ? well.name : 'N/A';
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
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={FILTER_OPTIONS.customerType}
        onAddNew={() => alert('Form pelanggan baru akan dibuka')}
        addButtonLabel="+ Pelanggan Baru"
      />

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama Pelanggan</th>
                {/* <th className="text-left py-4 px-6 font-semibold text-gray-700">Tipe</th> */}
                {/* <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th> */}
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Telepon</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Alamat</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Sumur yang digunakan</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Total Penggunaan Air</th>
                {/* <th className="text-right py-4 px-6 font-semibold text-gray-700">Deposit</th> */}
                {/* <th className="text-right py-4 px-6 font-semibold text-gray-700">Hutang</th> */}
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
                          {customer.name.split(' ')[0][0]}{customer.name.split(' ')[1]?.[0] || ''}
                        </div>
                        <p className="font-medium text-gray-800">{customer.name}</p>
                      </div>
                    </td>
                    {/* <td className="py-4 px-6">
                      <StatusBadge 
                        status={customer.type}
                        colorClass={getStatusColor(customer.type)}
                      />
                    </td> */}
                    {/* <td className="py-4 px-6 text-sm text-gray-600">{customer.email}</td> */}
                    <td className="py-4 px-6 text-sm text-gray-600">{customer.phone}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{customer.address}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 text-center">{getWellName(customer.wellId)}</td>
                    {/* <td className="py-4 px-6 text-right font-semibold text-green-600">
                      {formatCurrency(customer.totalDeposit)}
                    </td> */}
                    {/* <td className="py-4 px-6 text-right font-semibold text-red-600">
                      {formatCurrency(customer.totalDebt)}
                    </td> */}
                    <td className="py-4 px-6 text-center text-sm text-gray-700">
                      <span className="font-medium">{customer.wellSize}</span> m³
                    </td>
                    <td className={`py-4 px-6 text-right font-bold text-lg ${ balanceColor }`}>
                      {formatCurrency(Math.abs(balance))}
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
