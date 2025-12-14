import { employees } from '../data/dummyData';
import { useDataFilter } from '../hooks';
import { FilterBar, PageHeader, StatusBadge, EmptyState } from '../components';
import { FILTER_OPTIONS, getStatusColor, getPositionIcon, matchesSearch } from '../utils';

export default function Employees() {
  const { searchTerm, setSearchTerm, filterValue, setFilterValue, filteredData: filteredEmployees } = useDataFilter(
    employees,
    {
      searchPredicate: (employee, term) =>
        matchesSearch(term, employee.name, employee.email, employee.position),
      filterPredicate: (employee, status) =>
        status === 'All' || employee.status === status
    }
  );

  return (
    <div className="p-8">
      <PageHeader 
        title="Karyawan" 
        description="Kelola anggota tim dan informasi staf"
      />

      <FilterBar 
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari berdasarkan nama, email, atau posisi..."
        filterLabel="Status"
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={FILTER_OPTIONS.employeeStatus}
        onAddNew={() => alert('Form karyawan baru akan dibuka')}
        addButtonLabel="+ Karyawan Baru"
      />

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Posisi</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Kontak</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Tanggal Masuk</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {employee.name.split(' ')[0][0]}{employee.name.split(' ')[1]?.[0] || ''}
                      </div>
                      <p className="font-medium text-gray-800">{employee.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPositionIcon(employee.position)}</span>
                      <span className="text-gray-800">{employee.position}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{employee.phone}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.email}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.joinDate}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Edit
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <EmptyState message="No employees found" />
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm font-medium">Total Karyawan</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{employees.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm font-medium">Aktif</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {employees.filter(e => e.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm font-medium">Cuti</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {employees.filter(e => e.status === 'On Leave').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm font-medium">Tidak Aktif</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {employees.filter(e => e.status === 'Inactive').length}
          </p>
        </div>
      </div>
    </div>
  );
}
