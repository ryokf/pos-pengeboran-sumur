// Reusable table components for data display

export function TableHeader({ columns }) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`py-4 px-6 font-semibold text-gray-700 ${column.alignment || 'text-left'}`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function DataTable({ columns, data, renderRow, emptyMessage = 'No data found' }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader columns={columns} />
          <tbody>
            {data.map((item, idx) => renderRow(item, idx))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}

export function TableRow({ children, hover = true }) {
  return (
    <tr className={`border-b border-gray-100 ${hover ? 'hover:bg-gray-50 transition-colors' : ''}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, alignment = 'text-left', className = '' }) {
  return (
    <td className={`py-4 px-6 ${alignment} ${className}`}>
      {children}
    </td>
  );
}
