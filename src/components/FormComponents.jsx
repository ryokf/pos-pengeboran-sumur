// Reusable search input component
export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// Reusable filter select component
export function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

// Reusable filter bar with search and filter
export function FilterBar({ 
  searchValue, 
  onSearchChange, 
  searchPlaceholder = 'Search...',
  filterLabel,
  filterValue,
  onFilterChange,
  filterOptions,
  onAddNew,
  addButtonLabel = '+ New'
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchInput 
          value={searchValue} 
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
        
        {filterLabel && (
          <FilterSelect
            label={filterLabel}
            value={filterValue}
            onChange={onFilterChange}
            options={filterOptions}
          />
        )}
        
        <div className="flex items-end">
          <button 
            onClick={onAddNew}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {addButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable page header component
export function PageHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}

// Reusable badge/status component
export function StatusBadge({ status, colorClass }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}

// Reusable empty state component
export function EmptyState({ message = 'No items found' }) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
