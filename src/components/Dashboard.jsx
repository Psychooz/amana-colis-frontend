// src/components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { colisAPI } from '../services/api';
import { useFilters } from '../hooks/useFilters';
import Header from './Header';
import ColisTable from './ColisTable';
import AdvancedFilters from './shared/AdvancedFilters';
import {
  StatusDetailsChart,
  PaymentStatusChart,
  ShipmentStatusChart,
  TrendsChart,
  MoroccoMap
} from './statistics';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('envois');
  const [stats, setStats] = useState({
    totalColis: 0,
    totalEnvoisPeriode: 0,
    totalCrbt: 0,
    statusStats: {},
    paymentStats: {},
    monthlyStats: [],
    cityStats: {}
  });
  const [loading, setLoading] = useState(true);
  
  // Track the current active filters from either tab
  const [currentFilters, setCurrentFilters] = useState({});
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false);

  // Use the shared filters hook for statistics tab
  const {
    filters: statisticsFilters,
    showFilters,
    handleFilterChange,
    handleResetFilters,
    handleToggleFilters,
    hasActiveFilters,
    getFilterParams,
    getDateRangeForStats
  } = useFilters();

  // Fetch statistics data with current filters
  const fetchStats = useCallback(async (filters = {}, isFiltered = false) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      let response;
      
      if (isFiltered && Object.keys(filters).length > 0) {
        console.log('Calling filtered statistics with params:', filters);
        response = await colisAPI.getFilteredStatistics(user.id, filters);
      } else {
        // Use regular statistics API for unfiltered data or date range only
        const dateRange = filters.dateDepotStart && filters.dateDepotEnd ? 
          { startDate: filters.dateDepotStart, endDate: filters.dateDepotEnd } : 
          { startDate: undefined, endDate: undefined };
        console.log('Calling regular statistics with date range:', dateRange);
        response = await colisAPI.getStatistics(user.id, dateRange.startDate, dateRange.endDate);
      }
      
      setStats({
        totalColis: response.data.totalColis || 0,
        totalEnvoisPeriode: response.data.totalEnvoisPeriode || 0,
        totalCrbt: response.data.totalCrbt || 0,
        statusStats: response.data.statusStats || {},
        paymentStats: response.data.paymentStats || {},
        monthlyStats: response.data.monthlyStats || [],
        cityStats: response.data.cityStats || {}
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    fetchStats({}, false);
  }, [fetchStats]);

  // Handle filter changes from Statistics tab
  const handleApplyStatisticsFilters = () => {
    const filters = getFilterParams();
    setCurrentFilters(filters);
    setHasFiltersApplied(hasActiveFilters());
    console.log('Applying statistics filters:', filters);
    fetchStats(filters, hasActiveFilters());
  };

  const handleResetStatisticsFilters = () => {
    handleResetFilters();
    setCurrentFilters({});
    setHasFiltersApplied(false);
    console.log('Resetting statistics filters');
    fetchStats({}, false);
  };

  // Callback function for ColisTable to update top cards when filters are applied
  const handleTableFiltersApplied = useCallback((filters, isFiltered) => {
    console.log('Table filters applied:', filters, 'isFiltered:', isFiltered);
    setCurrentFilters(filters);
    setHasFiltersApplied(isFiltered);
    fetchStats(filters, isFiltered);
  }, [fetchStats]);

  // Handle tab switching - preserve filter state
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // When switching tabs, keep the current filter state for the top cards
    // No need to refetch here as the stats should already reflect current filters
  };

  // Calculate delivery rate for the KPI card
  const getDeliveryRate = () => {
    const delivered = stats.statusStats['Envoi livré'] || 0;
    const total = stats.totalColis || 1;
    return Math.round((delivered / total) * 100);
  };

  return (
    <div className="min-vh-100">
      <Header />
      <main>
        <div className="container-fluid">
          {/* Top 3 Cards - Always visible and reactive to filters from both tabs */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card text-center h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="card-title mb-0">
                      Total Colis
                      {hasFiltersApplied && <small className="ms-1">(filtré)</small>}
                    </h6>
                    <span style={{ fontSize: '1.5rem' }}>📦</span>
                  </div>
                  {loading ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <h2 className="mb-0">{stats.totalColis.toLocaleString()}</h2>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card text-center h-100" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="card-title mb-0">
                      Total CRBT
                      {hasFiltersApplied && <small className="ms-1">(filtré)</small>}
                    </h6>
                    <span style={{ fontSize: '1.5rem' }}>💰</span>
                  </div>
                  {loading ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <h2 className="mb-0">{stats.totalCrbt.toLocaleString()} MAD</h2>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card text-center h-100" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="card-title mb-0">
                      Taux de Livraison
                      {hasFiltersApplied && <small className="ms-1">(filtré)</small>}
                    </h6>
                    <span style={{ fontSize: '1.5rem' }}>📊</span>
                  </div>
                  {loading ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <h2 className="mb-0">{getDeliveryRate()}%</h2>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="row mb-4">
            <div className="col-12">
              <ul className="nav nav-tabs nav-justified" id="dashboardTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'envois' ? 'active' : ''}`}
                    onClick={() => handleTabChange('envois')}
                    type="button"
                    role="tab"
                  >
                    <i className="bi bi-table me-2"></i>
                    Mes Envois
                    {hasFiltersApplied && activeTab !== 'envois' && <span className="badge bg-danger ms-1">!</span>}
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'statistiques' ? 'active' : ''}`}
                    onClick={() => handleTabChange('statistiques')}
                    type="button"
                    role="tab"
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    Statistiques
                    {hasFiltersApplied && <span className="badge bg-danger ms-1">!</span>}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Envois Tab */}
            {activeTab === 'envois' && (
              <div className="tab-pane fade show active">
                <ColisTable onFiltersApplied={handleTableFiltersApplied} />
              </div>
            )}

            {/* Statistiques Tab */}
            {activeTab === 'statistiques' && (
              <div className="tab-pane fade show active">
                {/* Filters Section for Statistics */}
                <AdvancedFilters
                  filters={statisticsFilters}
                  onFilterChange={handleFilterChange}
                  onApplyFilters={handleApplyStatisticsFilters}
                  onResetFilters={handleResetStatisticsFilters}
                  showFilters={showFilters}
                  onToggleFilters={handleToggleFilters}
                  loading={loading}
                  title="Filtres pour les statistiques"
                />

                {/* Three Statistical Charts Row */}
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <StatusDetailsChart 
                      data={stats.statusStats}
                      loading={loading}
                    />
                  </div>
                  <div className="col-md-4">
                    <PaymentStatusChart 
                      data={stats.paymentStats}
                      loading={loading}
                    />
                  </div>
                  <div className="col-md-4">
                    <ShipmentStatusChart 
                      data={stats.statusStats}
                      loading={loading}
                    />
                  </div>
                </div>

                {/* Bottom Row - Trends Chart and Map */}
                <div className="row g-3 mb-4">
                  <div className="col-md-8">
                    <TrendsChart 
                      data={stats.monthlyStats}
                      loading={loading}
                    />
                  </div>
                  <div className="col-md-4">
                    <MoroccoMap 
                      data={stats.cityStats}
                      loading={loading}
                    />
                  </div>
                </div>

                {/* Statistics Summary Card */}
                {hasFiltersApplied && (
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h6 className="mb-0">
                            <i className="bi bi-info-circle me-2"></i>
                            Résumé des filtres appliqués
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-2">
                            {currentFilters.dateDepotStart && (
                              <div className="col-auto">
                                <span className="badge bg-primary">
                                  Période: {currentFilters.dateDepotStart} 
                                  {currentFilters.dateDepotEnd && ` - ${currentFilters.dateDepotEnd}`}
                                </span>
                              </div>
                            )}
                            {currentFilters.status && (
                              <div className="col-auto">
                                <span className="badge bg-secondary">Statut: {currentFilters.status}</span>
                              </div>
                            )}
                            {currentFilters.destination && (
                              <div className="col-auto">
                                <span className="badge bg-secondary">Destination: {currentFilters.destination}</span>
                              </div>
                            )}
                            {currentFilters.isPayed && (
                              <div className="col-auto">
                                <span className="badge bg-secondary">
                                  Paiement: {currentFilters.isPayed === 'true' ? 'Payé' : 'Impayé'}
                                </span>
                              </div>
                            )}
                            <div className="col-auto">
                              <span className="badge bg-info">
                                Total filtré: {stats.totalColis} colis
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;