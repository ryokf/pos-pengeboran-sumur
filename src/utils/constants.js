// Utility functions for color mapping across the application

export const STATUS_COLORS = {
  // Payment statuses
  Paid: 'bg-green-100 text-green-700',
  Partial: 'bg-orange-100 text-orange-700',
  Unpaid: 'bg-red-100 text-red-700',

  // General statuses
  Active: 'bg-green-100 text-green-700',

  // Customer types
  Individual: 'bg-purple-100 text-purple-700',
  Corporate: 'bg-indigo-100 text-indigo-700',
};

export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
};

// Filter options
export const FILTER_OPTIONS = {
  paymentStatus: ['All', 'Paid', 'Partial', 'Unpaid', 'Pending'],
  customerType: ['All', 'Individual', 'Corporate'],
};

// Currency formatter
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Case-insensitive search helper
export const matchesSearch = (searchTerm, ...fields) => {
  const term = searchTerm.toLowerCase();
  return fields.some(field =>
    String(field).toLowerCase().includes(term)
  );
};

// Pricing tiers for monthly billing based on well size
export const PRICING_TIERS = {
  SMALL_WELL_THRESHOLD: 5, // m³
  SMALL_WELL_PRICE: 3000, // Rp per m³
  LARGE_WELL_PRICE: 5000, // Rp per m³
};

// Calculate monthly billing based on well size
export const calculateMonthlyBilling = (wellSize) => {
  if (wellSize < PRICING_TIERS.SMALL_WELL_THRESHOLD) {
    return wellSize * PRICING_TIERS.SMALL_WELL_PRICE;
  }
  return wellSize * PRICING_TIERS.LARGE_WELL_PRICE;
};

// Navigation menu items
export const MENU_ITEMS = [
  { label: 'Dasbor', icon: '📊', path: '/' },
  { label: 'Pelanggan', icon: '👥', path: '/customers' },
  { label: 'Arus Kas', icon: '💰', path: '/finance/cash-flow' },
  { label: 'Tagihan', icon: '📋', path: '/finance/billing' },
  { label: 'Pengaturan', icon: '⚙️', path: '/settings' }
];

// Get initials from name
export const getInitials = (name) => {
  const parts = name.split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts[1]?.[0] || '';
  return (first + last).toUpperCase();
};
