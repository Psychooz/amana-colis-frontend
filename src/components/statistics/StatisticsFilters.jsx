import React, { useState } from 'react';

const StatisticsFilters = ({ onFilterChange, loading = false }) => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleDateChange = (field, value) => {
    const newRange = { ...dateRange, [field]: value };
    setDateRange(newRange);
    onFilterChange(newRange);
  };

  const handleReset = () => {
    const resetRange = { startDate: '', endDate: '' };
    setDateRange(resetRange);
    onFilterChange(resetRange);
  };

  const handleQuickSelect = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      case 'lastYear':
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    const newRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
    setDateRange(newRange);
    onFilterChange(newRange);
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h6 className="mb-0">
          <i className="bi bi-calendar-range me-2"></i>
          Filtres de période
        </h6>
      </div>
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Date de début</label>
            <input
              type="date"
              className="form-control"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Date de fin</label>
            <input
              type="date"
              className="form-control"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Sélection rapide</label>
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuickSelect('thisMonth')}
                disabled={loading}
              >
                Ce mois
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuickSelect('lastMonth')}
                disabled={loading}
              >
                Mois dernier
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuickSelect('thisYear')}
                disabled={loading}
              >
                Cette année
              </button>
            </div>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-outline-danger w-100"
              onClick={handleReset}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsFilters;