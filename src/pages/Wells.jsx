import { wells } from '../data/dummyData';
import { useDataFilter } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { FilterBar, PageHeader, EmptyState } from '../components';
import { FILTER_OPTIONS, matchesSearch } from '../utils';

export default function Wells() {
    const navigate = useNavigate();
    const { searchTerm, setSearchTerm, filterValue, setFilterValue, filteredData: filteredWells } = useDataFilter(
        wells,
        {
            searchPredicate: (well, term) =>
                matchesSearch(term, well.name, well.location, well.city),
            filterPredicate: (well, status) =>
                status === 'All' || well.status === status
        }
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'Inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-8">
            <PageHeader
                title="Daftar Sumur"
                description="Kelola informasi sumur yang memasok air ke pelanggan"
            />

            <FilterBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Cari berdasarkan nama, lokasi, atau kota..."
                filterLabel="Status"
                filterValue={filterValue}
                onFilterChange={setFilterValue}
                filterOptions={FILTER_OPTIONS.wellStatus}
                onAddNew={() => alert('Form sumur baru akan dibuka')}
                addButtonLabel="+ Sumur Baru"
            />

            {/* Wells Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama Sumur</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Lokasi</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Kota</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Kapasitas</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Produksi/Bulan</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Pelanggan</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWells.map((well) => (
                                <tr key={well.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                💧
                                            </div>
                                            <p className="font-medium text-gray-800">{well.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600">{well.location}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600">{well.city}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${ getStatusColor(well.status) }`}>
                                            {well.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-700">
                                        <span className="font-medium">{well.capacity}</span> m³/hari
                                    </td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-700">
                                        <span className="font-medium">{well.monthlyProduction}</span> m³
                                    </td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-700">
                                        <span className="font-medium">{well.connectedCustomers}</span> pelanggan
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => navigate(`/wells/${ well.id }`)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3"
                                        >
                                            Ubah
                                        </button>
                                        <button
                                            onClick={() => navigate(`/wells/${ well.id }`)}
                                            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                                        >
                                            Lihat
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredWells.length === 0 && (
                <EmptyState message="Tidak ada sumur ditemukan" />
            )}
        </div>
    );
}
