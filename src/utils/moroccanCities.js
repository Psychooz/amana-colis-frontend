import citiesData from '../data/moroccanCities.json';

export const getCityCount = (data, dataKeys) => {
  for (const key of dataKeys) {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
  }
  return 0;
};
export const getCitiesWithData = (data) => {
  return citiesData.cities.map(city => ({
    ...city,
    count: getCityCount(data, city.dataKeys)
  }));
};
export const getAllCities = () => {
  return citiesData.cities;
};