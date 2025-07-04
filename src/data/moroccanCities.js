// src/data/moroccanCities.js

export const moroccanCities = [
  { 
    name: 'Casablanca', 
    latitude: 33.5731, 
    longitude: -7.5898, 
    dataKeys: ['CASABLANCA', 'Casablanca'] 
  },
  { 
    name: 'Rabat', 
    latitude: 34.0209, 
    longitude: -6.8416, 
    dataKeys: ['RABAT', 'Rabat'] 
  },
  { 
    name: 'Fès', 
    latitude: 34.0181, 
    longitude: -5.0078, 
    dataKeys: ['FES', 'FÈS', 'Fes', 'Fès'] 
  },
  { 
    name: 'Marrakech', 
    latitude: 31.6295, 
    longitude: -7.9811, 
    dataKeys: ['MARRAKECH', 'Marrakech'] 
  },
  { 
    name: 'Tanger', 
    latitude: 35.7595, 
    longitude: -5.8340, 
    dataKeys: ['TANGER', 'Tanger'] 
  },
  { 
    name: 'Agadir', 
    latitude: 30.4278, 
    longitude: -9.5981, 
    dataKeys: ['AGADIR', 'Agadir'] 
  },
  { 
    name: 'Oujda', 
    latitude: 34.6814, 
    longitude: -1.9086, 
    dataKeys: ['OUJDA', 'Oujda'] 
  },
  { 
    name: 'Kenitra', 
    latitude: 34.2610, 
    longitude: -6.5802, 
    dataKeys: ['KENITRA', 'Kenitra'] 
  },
  { 
    name: 'Tetouan', 
    latitude: 35.5889, 
    longitude: -5.3626, 
    dataKeys: ['TETOUAN', 'Tetouan'] 
  },
  { 
    name: 'Salé', 
    latitude: 34.0531, 
    longitude: -6.7985, 
    dataKeys: ['SALE', 'SALÉ', 'Sale', 'Salé'] 
  },
  { 
    name: 'Meknès', 
    latitude: 33.8935, 
    longitude: -5.5473, 
    dataKeys: ['MEKNES', 'MEKNÈS', 'Meknes', 'Meknès'] 
  },
  { 
    name: 'Safi', 
    latitude: 32.2994, 
    longitude: -9.2372, 
    dataKeys: ['SAFI', 'Safi'] 
  },
  { 
    name: 'El Jadida', 
    latitude: 33.2316, 
    longitude: -8.5007, 
    dataKeys: ['EL_JADIDA', 'EL JADIDA', 'El Jadida'] 
  },
  { 
    name: 'Nador', 
    latitude: 35.1681, 
    longitude: -2.9287, 
    dataKeys: ['NADOR', 'Nador'] 
  },
  { 
    name: 'Settat', 
    latitude: 33.0013, 
    longitude: -7.6164, 
    dataKeys: ['SETTAT', 'Settat'] 
  },
  { 
    name: 'Khouribga', 
    latitude: 32.8811, 
    longitude: -6.9063, 
    dataKeys: ['KHOURIBGA', 'Khouribga'] 
  },
  { 
    name: 'Beni Mellal', 
    latitude: 32.3373, 
    longitude: -6.3498, 
    dataKeys: ['BENI_MELLAL', 'BENI MELLAL', 'Beni Mellal'] 
  },
  { 
    name: 'Larache', 
    latitude: 35.1933, 
    longitude: -6.1467, 
    dataKeys: ['LARACHE', 'Larache'] 
  },
  { 
    name: 'Ksar El Kebir', 
    latitude: 35.0017, 
    longitude: -5.9081, 
    dataKeys: ['KSAR_EL_KEBIR', 'KSAR EL KEBIR', 'Ksar El Kebir'] 
  },
  { 
    name: 'Mohammedia', 
    latitude: 33.6863, 
    longitude: -7.3829, 
    dataKeys: ['MOHAMMEDIA', 'Mohammedia'] 
  }
];

export const getCityCount = (data, dataKeys) => {
  for (const key of dataKeys) {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
  }
  return 0;
};

export const getCitiesWithData = (data) => {
  return moroccanCities.map(city => ({
    ...city,
    count: getCityCount(data, city.dataKeys)
  }));
};