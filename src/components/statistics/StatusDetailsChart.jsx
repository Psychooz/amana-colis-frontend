import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, CardHeader, CircularProgress, Box, Typography } from '@mui/material';
import { PieChart as PieChartIcon } from '@mui/icons-material';

const StatusDetailsChart = ({ data = {}, loading = false }) => {
  const statusColors = [
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#F59E0B', // Orange
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#06B6D4'  // Cyan
  ];

  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([status, value], index) => ({
      id: index,
      value: value,
      label: status,
      color: statusColors[index % statusColors.length]
    }));

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader 
          title="Détail des statuts"
          avatar={<PieChartIcon />}
        />
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
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
          title="Détail des statuts"
          avatar={<PieChartIcon />}
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
        title="Détail des statuts"
        avatar={<PieChartIcon color="primary" />}
      />
      <CardContent>
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 50,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 5,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={300}
          slotProps={{
            legend: {
              direction: 'column',
              position: { vertical: 'bottom', horizontal: 'left' },
              padding: 0,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StatusDetailsChart;