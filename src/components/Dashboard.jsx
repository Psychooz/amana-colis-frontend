import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { colisAPI } from '../services/api';
import Header from './Header';
import ColisTable from './ColisTable';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalColis: 0,
    totalEnvoisPeriode: 0,
    totalCrbt: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      
      try {
        const response = await colisAPI.getStatistics(user.id);
        setStats({
          totalColis: response.data.totalColis || 0,
          totalEnvoisPeriode: response.data.totalEnvoisPeriode || 0,
          totalCrbt: response.data.totalCrbt || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  return (
    <div className="min-vh-100">
      <Header />
      <main>
        <div className="container-fluid mb-4">
          {/* Top 3 Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card text-center h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="card-title mb-0">Nb. Colis affichés</h6>
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
                    <h6 className="card-title mb-0">Total envois de la période</h6>
                    <span style={{ fontSize: '1.5rem' }}>🚚</span>
                  </div>
                  {loading ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <h2 className="mb-0">{stats.totalEnvoisPeriode.toLocaleString()}</h2>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card text-center h-100" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
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
          </div>
        </div>
        
        <ColisTable />
      </main>
    </div>
  );
};

export default Dashboard;