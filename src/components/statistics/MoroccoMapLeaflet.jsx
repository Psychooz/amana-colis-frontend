import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { getCitiesWithData } from  '../../utils/moroccanCities';
import 'leaflet/dist/leaflet.css';

const SetMapBounds = () => {
  const map = useMap();
  
  React.useEffect(() => {

    const moroccanBounds = [
      [35.9, -1.0],
      [27.6, -13.2]
      //[20.73, -18.41]
    ];
    map.fitBounds(moroccanBounds, { padding: [10, 10] });
  }, [map]);

  return null;
};

const MoroccoMapLeaflet = ({ data = {}, loading = false }) => {
  const allCities = useMemo(() => getCitiesWithData(data), [data]);

  const citiesWithData = useMemo(() => {
    const filtered = allCities.filter(city => city.count > 0);
    const maxCount = Math.max(...filtered.map(city => city.count), 1);
    
    return filtered.map(city => ({
      ...city,
      radius: Math.max(8, (city.count / maxCount) * 25),
      color: getMarkerColor(city.count / maxCount),
      intensity: city.count / maxCount
    }));
  }, [allCities]);

  function getMarkerColor(intensity) {
    if (intensity > 0.7) return '#DC2626';
    if (intensity > 0.4) return '#F59E0B';
    if (intensity > 0.1) return '#10B981';
    return '#6B7280';
  }

  if (loading) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h6 className="mb-0">Map</h6>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (citiesWithData.length === 0) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h6 className="mb-0">
            <i className="bi bi-geo-alt me-2"></i>
            Map
          </h6>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <div className="text-muted">Aucune donnée géographique disponible</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-geo-alt me-2"></i>
            Map
          </h6>
          <small className="text-muted">
            {citiesWithData.length} ville{citiesWithData.length > 1 ? 's' : ''}
          </small>
        </div>
      </div>
      <div className="card-body p-0">
        <div style={{ height: '350px', position: 'relative' }}>
          <MapContainer
            center={[32, -6.5]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            dragging={true}
          >
            <SetMapBounds />
            
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={18}
            />

            {citiesWithData.map((city) => (
              <CircleMarker
                key={city.name}
                center={[city.latitude, city.longitude]}
                radius={city.radius}
                fillColor={city.color}
                color="white"
                weight={2}
                opacity={1}
                fillOpacity={0.8}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.setStyle({
                      fillOpacity: 1,
                      weight: 3
                    });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({
                      fillOpacity: 0.8,
                      weight: 2
                    });
                  }
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h6 className="mb-1 fw-bold">{city.name}</h6>
                    <div className="text-muted">
                      <div><strong>{city.count}</strong> envoi{city.count > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        
        {/* Legend and Statistics */}
        <div className="p-3 border-top">
          <div className="row">
            <div className="col-md-6">
              <small className="fw-bold d-block mb-2">Volume d'envois:</small>
              <div className="d-flex flex-wrap gap-2">
                <div className="d-flex align-items-center">
                  <div 
                    className="me-1 rounded-circle border border-white shadow-sm" 
                    style={{ 
                      width: '14px', 
                      height: '14px', 
                      backgroundColor: '#DC2626'
                    }}
                  ></div>
                  <small>Élevé (70%+)</small>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    className="me-1 rounded-circle border border-white shadow-sm" 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: '#F59E0B'
                    }}
                  ></div>
                  <small>Moyen (40-70%)</small>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    className="me-1 rounded-circle border border-white shadow-sm" 
                    style={{ 
                      width: '10px', 
                      height: '10px', 
                      backgroundColor: '#10B981'
                    }}
                  ></div>
                  <small>Faible (10-40%)</small>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    className="me-1 rounded-circle border border-white shadow-sm" 
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: '#6B7280'
                    }}
                  ></div>
                  <small>Très faible</small>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <small className="fw-bold d-block mb-2">Top destinations:</small>
              <div className="d-flex flex-wrap gap-1">
                {citiesWithData
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 4)
                  .map((city) => (
                    <span 
                      key={city.name} 
                      className="badge text-white"
                      style={{ backgroundColor: city.color }}
                    >
                      {city.name}: {city.count}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <small className="text-muted">
              Total: {citiesWithData.reduce((sum, city) => sum + city.count, 0)} envois
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoroccoMapLeaflet;