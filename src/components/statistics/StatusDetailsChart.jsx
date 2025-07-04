
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StatusDetailsChart = ({ data = {}, loading = false }) => {
  const COLORS = {
    'En transit': '#3B82F6',
    'Echec livraison, à récupérer': '#F59E0B', 
    'Échec livraison, à récupérer': '#F59E0B',
    'Envoi livré': '#10B981',
    'Envoi retourné': '#EF4444',
    'Déposé': '#8B5CF6',
    '2ème présentation': '#06B6D4'
  };

  const chartData = Object.entries(data).map(([statusName, count]) => ({
    name: statusName,
    value: count,
    color: COLORS[statusName] || '#94A3B8'
  })).filter(item => item.value > 0); 
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

  const CustomLegend = ({ payload }) => {
    if (!payload) return null;
    
    return (
      <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
        {payload.map((entry, index) => (
          <div key={index} className="d-flex align-items-center">
            <div 
              className="me-1" 
              style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: entry.color,
                borderRadius: '2px'
              }}
            ></div>
            <span style={{ fontSize: '11px', color: '#374151' }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h6 className="mb-0">Détail des statuts</h6>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h6 className="mb-0">
            <i className="bi bi-pie-chart me-2"></i>
            Détail des statuts
          </h6>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <div className="text-muted">Aucune donnée disponible</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header">
        <h6 className="mb-0">
          <i className="bi bi-pie-chart me-2"></i>
          Détail des statuts
        </h6>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <CustomLegend payload={chartData.map(item => ({ value: item.name, color: item.color }))} />
      </div>
    </div>
  );
};

export default StatusDetailsChart;