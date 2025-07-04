import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ShipmentStatusChart = ({ data = {}, loading = false }) => {
  const COLORS = {
    'En cours': '#F59E0B',
    'Retourné': '#EF4444',
    'Livré': '#10B981'
  };

  const getShipmentData = () => {
    const enCours = (data['En transit'] || 0) + (data['Déposé'] || 0) + (data['2ème présentation'] || 0);
    const retourne = data['Envoi retourné'] || 0;
    const livre = data['Envoi livré'] || 0;

    return {
      'En cours': enCours,
      'Retourné': retourne,
      'Livré': livre
    };
  };

  const shipmentData = getShipmentData();
  const chartData = Object.entries(shipmentData).map(([status, count]) => ({
    name: status,
    value: count,
    color: COLORS[status] || '#94A3B8'
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="mb-0">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h6 className="mb-0">Statut des envois</h6>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header">
        <h6 className="mb-0">
          <i className="bi bi-truck me-2"></i>
          Statut des envois
        </h6>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ShipmentStatusChart;