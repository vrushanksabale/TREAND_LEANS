import { RegionLocation } from '../types';

export const PRESET_REGIONS: RegionLocation[] = [
  {
    id: 'arctic_ocean',
    name: 'Arctic Ocean & High Latitudes',
    category: 'polar',
    description: 'High-latitude polar cap exhibiting Arctic amplification, rapid summer sea-ice retreat, and permafrost degradation.',
    lat: 78.5,
    lon: 15.0,
    bbox: [-180, 66, 180, 90],
    defaultZoom: 3
  },
  {
    id: 'antarctica_ross',
    name: 'Antarctic Ross & Weddell Seas',
    category: 'polar',
    description: 'Southern Ocean circumpolar margin governed by strong westerly winds, deep water upwelling, and ice-shelf dynamics.',
    lat: -75.0,
    lon: -170.0,
    bbox: [-180, -90, 180, -60],
    defaultZoom: 3
  },
  {
    id: 'amazon_basin',
    name: 'Amazon River Basin, Brazil',
    category: 'tropical',
    description: 'World’s largest tropical rainforest system, experiencing localized drought anomalies, deforestation, and convective shifts.',
    lat: -3.46,
    lon: -62.21,
    bbox: [-74, -16, -48, 5],
    defaultZoom: 5
  },
  {
    id: 'sahel_belt',
    name: 'Sahel Belt, Sub-Saharan Africa',
    category: 'arid',
    description: 'Semi-arid ecotone south of the Sahara observing episodic greening pulses tied to northward shifts of the Atlantic ITCZ.',
    lat: 14.5,
    lon: 2.0,
    bbox: [-18, 10, 35, 18],
    defaultZoom: 5
  },
  {
    id: 'mediterranean_basin',
    name: 'Mediterranean Basin (Southern Europe & Levant)',
    category: 'temperate',
    description: 'Climate hotspot under expanding subtropical high-pressure ridges with declining precipitation and frequent summer heat extremes.',
    lat: 38.0,
    lon: 20.0,
    bbox: [-10, 30, 36, 45],
    defaultZoom: 5
  },
  {
    id: 'indus_ganges_basin',
    name: 'Indus & Indo-Gangetic Plains, India',
    category: 'tropical',
    description: 'Critical agrarian belt with intense agricultural groundwater pumping, fluctuating monsoon precipitation, and seasonal aerosols.',
    lat: 27.5,
    lon: 77.0,
    bbox: [68, 22, 88, 32],
    defaultZoom: 6
  },
  {
    id: 'california_central_valley',
    name: 'California Central Valley & Sierra Nevada',
    category: 'temperate',
    description: 'Mediterranean climate zone experiencing extreme whiplash between atmospheric river deluge years and severe multi-year drought.',
    lat: 36.8,
    lon: -119.8,
    bbox: [-124, 34, -117, 42],
    defaultZoom: 6
  },
  {
    id: 'tibetan_plateau',
    name: 'Tibetan Plateau (Third Pole)',
    category: 'polar',
    description: 'High-altitude cryosphere feeding major Asian rivers, undergoing rapid thermal warming and accelerated glacial mass loss.',
    lat: 33.0,
    lon: 87.0,
    bbox: [75, 26, 105, 40],
    defaultZoom: 5
  },
  {
    id: 'australian_murray_darling',
    name: 'Murray–Darling Basin, Australia',
    category: 'arid',
    description: 'Extensive agricultural basin with high vulnerability to Indian Ocean Dipole swings, multi-year droughts, and bushfire seasons.',
    lat: -33.5,
    lon: 145.0,
    bbox: [138, -38, 153, -25],
    defaultZoom: 5
  },
  {
    id: 'siberian_boreal_forest',
    name: 'Siberian Boreal Taiga, Russia',
    category: 'polar',
    description: 'Vast boreal coniferous forest zone observing extended warm seasons, active lightning-sparked fire regimes, and greening trends.',
    lat: 62.0,
    lon: 105.0,
    bbox: [60, 52, 140, 72],
    defaultZoom: 4
  },
  {
    id: 'greenland_ice_sheet',
    name: 'Greenland Ice Sheet Summit & Margin',
    category: 'polar',
    description: 'Massive continental ice sheet tracked by GRACE-FO gravimetry and optical sensors showing elevated summer surface melt.',
    lat: 72.0,
    lon: -40.0,
    bbox: [-60, 60, -20, 84],
    defaultZoom: 4
  },
  {
    id: 'global_ocean_average',
    name: 'Global Tropics & Subtropics (30°S–30°N)',
    category: 'marine',
    description: 'Low-to-mid latitude ocean domain displaying multi-decadal sea-surface warming and marine heatwave frequency shifts.',
    lat: 0.0,
    lon: -160.0,
    bbox: [-180, -30, 180, 30],
    defaultZoom: 3
  }
];
