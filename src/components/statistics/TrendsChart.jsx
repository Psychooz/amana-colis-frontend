import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendsChart = ({ data = [], loading = false }) => {
  const formatMonth = (year, month) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
  };

  const chartData = data.map(item => ({
    month: formatMonth(item.year, item.month),
    totalColis: item.totalColis || 0,
    totalCrbt: item.totalCrbt || 0,
    fullDate: `${item.year}-${item.month.toString().padStart(2, '0')}`
  })).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="mb-2 fw-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-1" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Total CRBT' ? `${entry.value.toLocaleString()} MAD` : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h6 className="mb-0">Évolution mensuelle</h6>
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
          <i className="bi bi-graph-up me-2"></i>
          Évolution mensuelle - Total CRBT vs Total Envois
        </h6>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalColis"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Total Envois"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalCrbt"
              stroke="#10B981"
              strokeWidth={3}
              name="Total CRBT"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsChart;