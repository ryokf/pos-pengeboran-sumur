// Utility functions for color mapping across the application

export const STATUS_COLORS = {
  // Order/Project statuses
  Completed: 'bg-green-100 text-green-700',
  'Drilling': 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  
  // Payment statuses
  Paid: 'bg-green-100 text-green-700',
  Partial: 'bg-orange-100 text-orange-700',
  Unpaid: 'bg-red-100 text-red-700',
  
  // Employee statuses
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-yellow-100 text-yellow-700',
  Inactive: 'bg-red-100 text-red-700',
  
  // Customer types
  Individual: 'bg-purple-100 text-purple-700',
  Corporate: 'bg-indigo-100 text-indigo-700',
};

export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
};

// Icon mappings
export const POSITION_ICONS = {
  'Manager': '👔',
  'Operator Bor': '⛏️',
  'Admin': '💼',
  'Teknisi': '🔧',
};

export const getPositionIcon = (position) => {
  return POSITION_ICONS[position] || '👤';
};

// Filter options
export const FILTER_OPTIONS = {
  orderStatus: ['All', 'Completed', 'Drilling', 'Pending'],
  paymentStatus: ['All', 'Paid', 'Partial', 'Unpaid', 'Pending'],
  customerType: ['All', 'Individual', 'Corporate'],
  employeeStatus: ['All', 'Active', 'On Leave', 'Inactive'],
};

// Currency formatter
export const formatCurrency = (amount) => {
  return `Rp ${(amount / 1000000).toFixed(1)}M`;
};

// Case-insensitive search helper
export const matchesSearch = (searchTerm, ...fields) => {
  const term = searchTerm.toLowerCase();
  return fields.some(field => 
    String(field).toLowerCase().includes(term)
  );
};
