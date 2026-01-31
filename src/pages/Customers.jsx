import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterBar, PageHeader, EmptyState, AddCustomerModal } from '../components';
import { matchesSearch, formatCurrency, getInitials } from '../utils';
import { getCustomers, addCustomer } from '../services/customerService';

export default function Customers() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRT, setSelectedRT] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCustomers = async () => {
    const data = await getCustomers()
    setCustomerData(data)
    console.log(data);
  }

  useEffect(() => {
    fetchCustomers();
  }, [])

  const handleAddCustomer = async (formData) => {
    setSubmitting(true);
    try {
      await addCustomer(formData);
      alert('Pelanggan berhasil ditambahkan!');
      setIsModalOpen(false);
      // Refresh customer list
      fetchCustomers();
    } catch (error) {
      alert('Gagal menambahkan pelanggan: ' + error.message);
      console.error('Error adding customer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique RT values from customers
  const rtOptions = ['All', ...new Set(customerData.map(c => c.rt).filter(rt => rt))].sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return a.localeCompare(b);
  });

  // Filter customers based on search term and RT
  const filteredCustomers = customerData.filter(customer => {
    const matchesSearchTerm = matchesSearch(searchTerm, customer.name, customer.email, customer.phone);
    const matchesRT = selectedRT === 'All' || customer.rt === selectedRT;
    return matchesSearchTerm && matchesRT;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to page 1 when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRT, itemsPerPage]);

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
        onAddNew={() => setIsModalOpen(true)}
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
                {rt === 'All' ? 'Semua RT' : `RT ${ rt }`}
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
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Total Penggunaan Air</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Saldo</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => {
                const balanceColor = customer.current_balance >= 0 ? 'text-green-600' : 'text-red-600';

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
                    <td className="py-4 px-6 text-sm text-gray-600">{customer.phone ? customer.phone : "-"}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        RT {customer.rt}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{customer.address}</td>

                    <td className="py-4 px-6 text-center text-sm text-gray-700">
                      <span className="font-medium">{customer.total_usage_m3}</span> m³
                    </td>
                    <td className={`py-4 px-6 text-right font-bold text-lg ${ balanceColor }`}>
                      {customer.current_balance >= 0 ? '+' : '-'}{formatCurrency(Math.abs(customer.current_balance))}
                    </td>
                    <td className="py-4 px-6 text-center">
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

        {/* Pagination Controls */}
        {filteredCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Showing info */}
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, filteredCustomers.length)}</span> dari <span className="font-semibold">{filteredCustomers.length}</span> pelanggan
            </div>

            <div className="flex items-center gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="items-per-page" className="text-sm text-gray-600">Per halaman:</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  ← Prev
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    const showEllipsis =
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${ currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredCustomers.length === 0 && (
        <EmptyState message="Tidak ada pelanggan ditemukan" />
      )}

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCustomer}
        submitting={submitting}
      />
    </div>
  );
}
