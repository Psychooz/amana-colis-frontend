// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
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

  // Use the shared filters hook for statistics
  const {
    filters,
    showFilters,
    handleFilterChange,
    handleResetFilters,
    handleToggleFilters,
    hasActiveFilters,
    getFilterParams,
    getDateRangeForStats
  } = useFilters();

  // Fetch statistics data
  const fetchStats = async (useFilters = false) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      let startDate, endDate;
      
      if (useFilters && hasActiveFilters()) {
        // Use filters for date range
        const dateRange = getDateRangeForStats();
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
      }
      
      const response = await colisAPI.getStatistics(user.id, startDate, endDate);
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
  };

  useEffect(() => {
    fetchStats(hasActiveFilters());
  }, [user?.id]);

  // Handle filter changes for statistics
  const handleApplyFilters = () => {
    fetchStats(true);
  };

  const handleResetFiltersAndRefresh = () => {
    handleResetFilters();
    fetchStats(false);
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
          {/* Top 3 Cards - Always visible */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card text-center h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="card-title mb-0">Total Colis</h6>
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
                    <h6 className="card-title mb-0">Total CRBT</h6>
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
                    <h6 className="card-title mb-0">Taux de Livraison</h6>
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
                    onClick={() => setActiveTab('envois')}
                    type="button"
                    role="tab"
                  >
                    <i className="bi bi-table me-2"></i>
                    Mes Envois
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'statistiques' ? 'active' : ''}`}
                    onClick={() => setActiveTab('statistiques')}
                    type="button"
                    role="tab"
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    Statistiques
                    {hasActiveFilters() && <span className="badge bg-danger ms-1">!</span>}
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
                <ColisTable />
              </div>
            )}

            {/* Statistiques Tab */}
            {activeTab === 'statistiques' && (
              <div className="tab-pane fade show active">
                {/* Filters Section for Statistics */}
                <AdvancedFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFiltersAndRefresh}
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
                {hasActiveFilters() && (
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
                            {filters.dateDepotStart && (
                              <div className="col-auto">
                                <span className="badge bg-primary">
                                  Période: {filters.dateDepotStart} 
                                  {filters.dateDepotEnd && ` - ${filters.dateDepotEnd}`}
                                </span>
                              </div>
                            )}
                            {filters.status && (
                              <div className="col-auto">
                                <span className="badge bg-secondary">Statut: {filters.status}</span>
                              </div>
                            )}
                            {filters.destination && (
                              <div className="col-auto">
                                <span className="badge bg-secondary">Destination: {filters.destination}</span>
                              </div>
                            )}
                            {filters.isPayed && (
                              <div className="col-auto">
                                <span className="badge bg-secondary">
                                  Paiement: {filters.isPayed === 'true' ? 'Payé' : 'Impayé'}
                                </span>
                              </div>
                            )}
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