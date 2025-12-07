import { orders } from '../data/dummyData';
import { useDataFilter } from '../hooks';
import { FilterBar, PageHeader, StatusBadge, EmptyState } from '../components';
import { FILTER_OPTIONS, getStatusColor, formatCurrency, matchesSearch } from '../utils';

export default function Orders() {
    const { searchTerm, setSearchTerm, filterValue, setFilterValue, filteredData: filteredOrders } = useDataFilter(
        orders,
        {
            searchPredicate: (order, term) => 
                matchesSearch(term, order.id, order.customerName, order.projectName),
            filterPredicate: (order, status) => 
                status === 'All' || order.status === status
        }
    );

    return (
        <div className="p-8">
            <PageHeader 
                title="Orders" 
                description="Manage and track all orders"
            />

            <FilterBar 
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search by Order ID, Customer, or Project..."
                filterLabel="Status"
                filterValue={filterValue}
                onFilterChange={setFilterValue}
                filterOptions={FILTER_OPTIONS.orderStatus}
                onAddNew={() => alert('New order form would open')}
                addButtonLabel="+ New Order"
            />

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Order ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Project</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Payment</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Amount</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <span className="font-semibold text-gray-800">{order.id}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-medium text-gray-800">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">ID: {order.customerId}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        <p className="text-sm font-medium">{order.projectName}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge 
                                            status={order.status}
                                            colorClass={getStatusColor(order.status)}
                                        />
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge 
                                            status={order.paymentStatus}
                                            colorClass={getStatusColor(order.paymentStatus)}
                                        />
                                    </td>
                                    <td className="py-4 px-6 text-right font-semibold text-gray-800">
                                        {formatCurrency(order.amount)}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredOrders.length === 0 && (
                <EmptyState message="No orders found" />
            )}
        </div>
    );
}
