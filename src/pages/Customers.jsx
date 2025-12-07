import { customers } from '../data/dummyData';
import { useDataFilter } from '../hooks';
import { FilterBar, PageHeader, StatusBadge, EmptyState } from '../components';
import { FILTER_OPTIONS, getStatusColor, matchesSearch, formatCurrency } from '../utils';

export default function Customers() {
  const { searchTerm, setSearchTerm, filterValue, setFilterValue, filteredData: filteredCustomers } = useDataFilter(
    customers,
    {
      searchPredicate: (customer, term) =>
        matchesSearch(term, customer.name, customer.email, customer.phone),
      filterPredicate: (customer, type) =>
        type === 'All' || customer.type === type
    }
  );

  // Calculate customer balance (positive = surplus, negative = debt)
  const getCustomerBalance = (customer) => {
    return customer.totalDeposit - customer.totalDebt;
  };

  return (
    <div className="p-8">
      <PageHeader 
        title="Customers" 
        description="Manage customer information and relationships"
      />

      <FilterBar 
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by name, email, or phone..."
        filterLabel="Type"
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={FILTER_OPTIONS.customerType}
        onAddNew={() => alert('New customer form would open')}
        addButtonLabel="+ New Customer"
      />

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama Pelanggan</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Tipe</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Telepon</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Lokasi</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Deposit</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Hutang</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Saldo</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const balance = getCustomerBalance(customer);
                const balanceColor = balance >= 0 ? 'text-green-600' : 'text-red-600';
                const balanceSign = balance >= 0 ? '+' : '';

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
                    <td className="py-4 px-6">
                      <StatusBadge 
                        status={customer.type}
                        colorClass={getStatusColor(customer.type)}
                      />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{customer.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{customer.phone}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{customer.city}</td>
                    <td className="py-4 px-6 text-right font-semibold text-green-600">
                      {formatCurrency(customer.totalDeposit)}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-red-600">
                      {formatCurrency(customer.totalDebt)}
                    </td>
                    <td className={`py-4 px-6 text-right font-bold text-lg ${balanceColor}`}>
                      {balanceSign}{formatCurrency(Math.abs(balance))}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3">
                        Edit
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                        Detail
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
        <EmptyState message="No customers found" />
      )}
    </div>
  );
}
