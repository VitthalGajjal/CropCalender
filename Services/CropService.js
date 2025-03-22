import cropsData from '../assets/data/data.json';

const cropService = {
  getRegions: () => {
    return cropsData.map(regionData => regionData.region);
  },

  getCropsByRegion: (region) => {
    const regionData = cropsData.find(regionData => regionData.region === region);
    return regionData ? regionData.crops : [];
  },

  getSoilTypesByCropAndRegion: (cropName, region) => {
      const regionData = cropsData.find(regionData => regionData.region === region);
      if (!regionData) return [];

      const crop = regionData.crops.find(crop => crop.name === cropName);
      return crop ? crop.soilTypes : [];
  },

    getClimateConditionsByCropAndRegion: (cropName, region) => {
        const regionData = cropsData.find(regionData => regionData.region === region);
        if (!regionData) return [];

        const crop = regionData.crops.find(crop => crop.name === cropName);
        return crop ? crop.climateConditions : [];
    },

  getCropDetails: (region, cropName) => {
    const regionData = cropsData.find(regionData => regionData.region === region);
    if (!regionData) return null;
    return regionData.crops.find(crop => crop.name === cropName) || null;
  },
};

export default cropService;