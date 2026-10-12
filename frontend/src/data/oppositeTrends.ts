import { OppositeTrendPair } from '../types';

export const OPPOSITE_TREND_PAIRS: OppositeTrendPair[] = [
  {
    id: 'polar_divergence',
    title: 'Polar Divergence: Arctic Amplification vs. Southern Ocean Delay',
    theme: 'Cryosphere & Ocean Circulation Dynamics',
    summary: 'The Arctic is warming at more than three times the planetary rate, causing rapid sea-ice retreat, while parts of the Southern Ocean experience delayed warming due to deep, upwelling circumpolar currents.',
    connectedMechanism: 'Global atmospheric warming warms both polar caps, but the Southern Ocean is dominated by deep Ekman upwelling of cold, pre-industrial deep waters driven by fierce westerly winds. In contrast, the land-locked Arctic ocean basin traps heat and triggers aggressive ice-albedo feedbacks.',
    primaryRegion: {
      name: 'Arctic Ocean & High Latitudes',
      variableId: 'sea_ice_extent',
      lat: 78.5,
      lon: 15.0,
      trendDirection: 'decreasing',
      rateText: '-0.58% coverage / year (p < 0.001)',
      driverSummary: 'Ice-albedo positive feedback and poleward atmospheric heat transport.'
    },
    secondaryRegion: {
      name: 'Antarctic Ross & Weddell Margins',
      variableId: 'sea_ice_extent',
      lat: -75.0,
      lon: -170.0,
      trendDirection: 'decreasing',
      rateText: '-0.12% coverage / year (p = 0.082)',
      driverSummary: 'Deep circumpolar upwelling buffering thermal changes until recent extreme shifts.'
    }
  },
  {
    id: 'sahel_vs_mediterranean',
    title: 'Sahel Greening vs. Mediterranean Drying',
    theme: 'Subtropical Hadley Cell Expansion & Monsoon Dynamics',
    summary: 'While the Mediterranean basin is drying and experiencing canopy browning under expanding subtropical high pressure, the semi-arid African Sahel has observed episodic rainfall recovery and greening pulses.',
    connectedMechanism: 'Poleward expansion of the atmospheric Hadley circulation pushes storm tracks away from southern Europe and North Africa, inducing persistent drying. Concurrently, differential land-sea thermal warming pulls the Atlantic monsoon and Intertropical Convergence Zone (ITCZ) slightly northward into the southern Sahel.',
    primaryRegion: {
      name: 'Sahel Belt, Sub-Saharan Africa',
      variableId: 'vegetation_index',
      lat: 14.5,
      lon: 2.0,
      trendDirection: 'increasing',
      rateText: '+0.0022 NDVI / year (p = 0.012)',
      driverSummary: 'Monsoonal rain recovery and CO2 fertilization in semi-arid shrubs.'
    },
    secondaryRegion: {
      name: 'Mediterranean Basin (Southern Europe)',
      variableId: 'vegetation_index',
      lat: 38.0,
      lon: 20.0,
      trendDirection: 'decreasing',
      rateText: '-0.0019 NDVI / year (p = 0.028)',
      driverSummary: 'Subtropical high-pressure ridge persistence and vapor pressure deficit.'
    }
  },
  {
    id: 'california_rain_vs_groundwater',
    title: 'Atmospheric Deluge vs. Deep Aquifer Exhaustion',
    theme: 'Surface Hydrological Volatility vs Subsurface Storage',
    summary: 'Episodic atmospheric river winters bring massive deluge rainfall to California, yet GRACE-FO gravimetry documents a multi-decadal downward trajectory in subterranean groundwater storage.',
    connectedMechanism: 'High-intensity precipitation delivers surface runoff faster than heavy clay soils and overdrafted aquifers can absorb. Structural agricultural irrigation demands exceed natural percolation rates, creating an opposite slope between extreme weather events and unconfined aquifer volume.',
    primaryRegion: {
      name: 'California Sierra Nevada & Coast',
      variableId: 'precipitation',
      lat: 38.5,
      lon: -120.5,
      trendDirection: 'increasing',
      rateText: '+0.032 mm/day / year extreme events (p = 0.068)',
      driverSummary: 'Intensified Pacific atmospheric river vapor transport columns.'
    },
    secondaryRegion: {
      name: 'California Central Valley Aquifer',
      variableId: 'groundwater_storage',
      lat: 36.8,
      lon: -119.8,
      trendDirection: 'decreasing',
      rateText: '-1.95 cm eq. water / year (p < 0.0001)',
      driverSummary: 'Unregulated deep agricultural well extraction exceeding recharge.'
    }
  },
  {
    id: 'amazon_vs_ocean',
    title: 'Amazon Canopy Evaporation Deficit vs Tropical Ocean Warming',
    theme: 'Continental Biosphere vs Tropical Sea-Surface Coupling',
    summary: 'Tropical Atlantic and Pacific oceans exhibit sustained sea-surface warming, which alters circulation and fuels recurrent severe drought episodes across the Amazon rainforest canopy.',
    connectedMechanism: 'Warm tropical North Atlantic sea surface temperatures shift the ITCZ northward during the dry season, suppressing moisture convergence over the southern Amazon basin and prolonging forest vapor pressure deficit.',
    primaryRegion: {
      name: 'Global Tropics Marine Basin',
      variableId: 'surface_temperature',
      lat: 0.0,
      lon: -160.0,
      trendDirection: 'increasing',
      rateText: '+0.026 °C / year (p < 0.0001)',
      driverSummary: 'Global marine heat absorption and greenhouse thermal forcing.'
    },
    secondaryRegion: {
      name: 'Amazon River Basin',
      variableId: 'vegetation_index',
      lat: -3.46,
      lon: -62.21,
      trendDirection: 'decreasing',
      rateText: '-0.0018 NDVI / year (p = 0.034)',
      driverSummary: 'Canopy moisture stress and prolonged dry season evaporative demand.'
    }
  }
];
