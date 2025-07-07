import { useState } from 'react';

export const useFilters = (initialFilters = {}) => {
  const defaultFilters = {
    codeEnvoi: '',
    telDestinataire: '',
    status: '',
    destination: '',
    isPayed: '',
    dateDepotStart: '',
    dateDepotEnd: '',
    dateStatutStart: '',
    dateStatutEnd: '',
    datePaiementStart: '',
    datePaiementEnd: '',
    ...initialFilters
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [showFilters, setShowFilters] = useState(true);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(filter => filter !== '');
  };

  const getFilterParams = () => {
    const activeFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        activeFilters[key] = value;
      }
    });
    return activeFilters;
  };

  const getDateRangeForStats = () => {
    const startDate = filters.dateDepotStart || undefined;
    const endDate = filters.dateDepotEnd || undefined;
    return { startDate, endDate };
  };

  return {
    filters,
    showFilters,
    handleFilterChange,
    handleResetFilters,
    handleToggleFilters,
    hasActiveFilters,
    getFilterParams,
    getDateRangeForStats,
    setFilters,
    setShowFilters
  };
};