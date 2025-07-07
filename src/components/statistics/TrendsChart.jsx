import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, CardContent, CardHeader, CircularProgress, Box, Typography } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const TrendsChart = ({ data = [], loading = false }) => {
  const formatMonth = (year, month) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
  };

  const chartData = data
    .map(item => ({
      month: formatMonth(item.year, item.month),
      totalColis: item.totalColis || 0,
      totalCrbt: item.totalCrbt || 0,
      fullDate: `${item.year}-${item.month.toString().padStart(2, '0')}`
    }))
    .sort((a, b) => a.fullDate.localeCompare(b.fullDate));

  const xLabels = chartData.map(item => item.month);
  const colisData = chartData.map(item => item.totalColis);
  const crbtData = chartData.map(item => item.totalCrbt);
  const maxColis = Math.max(...colisData);
  const maxCrbt = Math.max(...crbtData);
  const scalingFactor = maxColis > 0 ? maxColis / maxCrbt : 1;
  const normalizedCrbtData = crbtData.map(value => value * scalingFactor);

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader 
          title="Évolution mensuelle"
          avatar={<TrendingUp />}
        />
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader 
          title="Évolution mensuelle - Total CRBT vs Total Envois"
          avatar={<TrendingUp />}
        />
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
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
        title="Évolution mensuelle - Total CRBT vs Total Envois"
        avatar={<TrendingUp color="primary" />}
      />
      <CardContent>
        <LineChart
          width={undefined}
          height={400}
          series={[
            {
              data: colisData,
              label: 'Total Envois',
              color: '#3B82F6',
              curve: 'linear',
            },
            {
              data: normalizedCrbtData,
              label: 'Total CRBT',
              color: '#10B981',
              curve: 'linear',
            },
          ]}
          xAxis={[
            {
              scaleType: 'point',
              data: xLabels,
            },
          ]}
          yAxis={[
            {
              id: 'leftAxis',
              scaleType: 'linear',
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
          margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'top', horizontal: 'center' },
              padding: 0,
            },
          }}
        />
        
      </CardContent>
    </Card>
  );
};

export default TrendsChart;