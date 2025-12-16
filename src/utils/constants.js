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
  { label: 'Pencatatan Meteran', icon: '📏', path: '/meter-readings' },
  { label: 'Tagihan', icon: '📋', path: '/finance/billing' },
  { label: 'Laporan Keuangan', icon: '💰', path: '/finance/report' },
  { label: 'Pengaturan', icon: '⚙️', path: '/settings' }
];

// Get initials from name
export const getInitials = (name) => {
  const parts = name.split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts[1]?.[0] || '';
  return (first + last).toUpperCase();
};

// Financial reporting utilities

// Filter transactions by period (monthly or annual)
export const filterTransactionsByPeriod = (transactions, period, year, month = null) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionYear = transactionDate.getFullYear();

    if (period === 'annual') {
      return transactionYear === year;
    } else if (period === 'monthly') {
      const transactionMonth = transactionDate.getMonth() + 1; // 0-indexed to 1-indexed
      return transactionYear === year && transactionMonth === month;
    }
    return false;
  });
};

// Calculate financial summary from transactions and customers
export const calculateFinancialSummary = (transactions, customers) => {
  const totalIncome = transactions
    .filter(t => t.type === 'IN')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'OUT')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Calculate outstanding debts (negative customer balances)
  const outstandingDebts = customers
    .filter(c => c.saldo < 0)
    .reduce((sum, c) => sum + Math.abs(c.saldo), 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    outstandingDebts
  };
};

// Format report period for display
export const formatReportPeriod = (period, year, month = null) => {
  if (period === 'annual') {
    return `Tahun ${ year }`;
  } else if (period === 'monthly') {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${ monthNames[month - 1] } ${ year }`;
  }
  return '';
};

// Get available years from transactions
export const getAvailableYears = (transactions) => {
  const years = transactions.map(t => new Date(t.date).getFullYear());
  return [...new Set(years)].sort((a, b) => b - a);
};

// Get available months for a specific year
export const getAvailableMonths = (transactions, year) => {
  const monthsSet = new Set();
  transactions.forEach(t => {
    const date = new Date(t.date);
    if (date.getFullYear() === year) {
      monthsSet.add(date.getMonth() + 1);
    }
  });
  return [...monthsSet].sort((a, b) => a - b);
};

// Meter Reading Utilities

// Get latest meter reading for a customer
export const getLatestMeterReading = (customerId, meterReadings) => {
  const customerReadings = meterReadings
    .filter(r => r.customerId === customerId)
    .sort((a, b) => new Date(b.readingDate) - new Date(a.readingDate));
  return customerReadings[0] || null;
};

// Get previous meter reading (before a specific date)
export const getPreviousMeterReading = (customerId, meterReadings, beforeDate) => {
  const customerReadings = meterReadings
    .filter(r => r.customerId === customerId && new Date(r.readingDate) < new Date(beforeDate))
    .sort((a, b) => new Date(b.readingDate) - new Date(a.readingDate));
  return customerReadings[0] || null;
};

// Calculate usage between two readings
export const calculateUsage = (currentReading, previousReading) => {
  if (!currentReading || !previousReading) return 0;
  return currentReading.meterValue - previousReading.meterValue;
};

// Get all meter readings for a customer (sorted by date, newest first)
export const getCustomerMeterReadings = (customerId, meterReadings) => {
  return meterReadings
    .filter(r => r.customerId === customerId)
    .sort((a, b) => new Date(b.readingDate) - new Date(a.readingDate));
};

// Format date for display in Indonesian format
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${ year }-${ month }-${ day }`;
};
