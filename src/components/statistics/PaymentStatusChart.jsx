import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const PaymentStatusChart = ({ data = {}, loading = false }) => {
  const COLORS = {
    'Payé': '#10B981',
    'Impayé': '#EF4444'
  };

  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count,
    color: COLORS[status] || '#94A3B8'
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const payedPercentage = total > 0 ? Math.round((data['Payé'] || 0) / total * 100) : 0;

  if (loading) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h6 className="mb-0">Statut des Paiements</h6>
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
          <i className="bi bi-cash-coin me-2"></i>
          Statut des Paiements
        </h6>
      </div>
      <div className="card-body text-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-3">
          <h4 className="text-success mb-1">{payedPercentage}% Payé</h4>
          <div className="d-flex justify-content-center gap-3">
            <div className="d-flex align-items-center">
              <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#10B981' }}></div>
              <small>Payé ({data['Payé'] || 0})</small>
            </div>
            <div className="d-flex align-items-center">
              <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#EF4444' }}></div>
              <small>Impayé ({data['Impayé'] || 0})</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusChart;