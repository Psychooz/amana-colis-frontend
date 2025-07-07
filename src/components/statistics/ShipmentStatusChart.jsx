import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, CardHeader, CircularProgress, Box, Typography } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';

const ShipmentStatusChart = ({ data = {}, loading = false }) => {
  const getShipmentData = () => {
    const enCours = (data['En transit'] || 0) + (data['Déposé'] || 0) + (data['2ème présentation'] || 0);
    const retourne = data['Envoi retourné'] || 0;
    const livre = data['Envoi livré'] || 0;

    return [
      { id: 'en-cours', value: enCours, label: 'En cours', color: '#F59E0B' },
      { id: 'retourne', value: retourne, label: 'Retourné', color: '#EF4444' },
      { id: 'livre', value: livre, label: 'Livré', color: '#10B981' }
    ].filter(item => item.value > 0);
  };

  const chartData = getShipmentData();

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader 
          title="Statut des envois"
          avatar={<LocalShipping />}
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
          title="Statut des envois"
          avatar={<LocalShipping />}
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
        title="Statut des envois"
        avatar={<LocalShipping color="primary" />}
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

export default ShipmentStatusChart;