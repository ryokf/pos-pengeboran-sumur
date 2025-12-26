import { useState } from 'react';

/**
 * Custom hook for managing filter and search functionality
 * @param {Array} data - The data to filter
 * @param {Object} config - Configuration for the hook
 * @param {Function} config.searchPredicate - Function to determine if item matches search
 * @param {Function} config.filterPredicate - Function to determine if item matches filter
 * @returns {Object} - Filtered data and state setters
 */
export function useDataFilter(data, config) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('All');

  const filteredData = data.filter(item => {
    const matchesSearchTerm = config.searchPredicate 
      ? config.searchPredicate(item, searchTerm)
      : true;
    
    const matchesFilter = config.filterPredicate
      ? config.filterPredicate(item, filterValue)
      : true;

    return matchesSearchTerm && matchesFilter;
  });

  return {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    filteredData
  };
}
