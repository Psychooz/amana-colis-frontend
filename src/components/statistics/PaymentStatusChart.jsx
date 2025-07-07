import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, CardHeader, CircularProgress, Box, Typography, Chip } from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';

const PaymentStatusChart = ({ data = {}, loading = false }) => {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([status, value]) => ({
      id: status,
      value: value,
      label: status,
      color: status === 'Payé' ? '#10B981' : '#EF4444'
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const payedPercentage = total > 0 ? Math.round((data['Payé'] || 0) / total * 100) : 0;

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader 
          title="Statut des Paiements"
          avatar={<AccountBalanceWallet />}
        />
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (total === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader 
          title="Statut des Paiements"
          avatar={<AccountBalanceWallet />}
        />
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <Typography color="text.secondary">
              Aucune donnée disponible
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader 
        title="Statut des Paiements"
        avatar={<AccountBalanceWallet color="primary" />}
      />
      <CardContent>
        <Box textAlign="center">
          <Typography variant="h3" color="success.main" fontWeight="bold" mb={1}>
            {payedPercentage}% Payé
          </Typography>
          
          <PieChart
            series={[
              {
                data: chartData,
                innerRadius: 60,
                outerRadius: 100,
                startAngle: 90,
                endAngle: -90,
                cornerRadius: 10,
              },
            ]}
            height={200}
            margin={{ top: 20, bottom: 0, left: 0, right: 0 }}
          />
          
          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            {chartData.map((item) => (
              <Chip
                key={item.id}
                label={`${item.label}: ${item.value}`}
                sx={{
                  backgroundColor: item.color,
                  color: 'white',
                  fontWeight: 'medium'
                }}
                size="small"
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentStatusChart;