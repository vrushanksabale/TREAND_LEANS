import { DataSourceMetadata } from '../types';

export const DATA_SOURCES_CATALOG: DataSourceMetadata[] = [
  {
    id: 'nasa_power',
    name: 'NASA POWER Project (Prediction of Worldwide Energy Resources)',
    agency: 'NASA Langley Research Center (LaRC)',
    missionOrModel: 'MERRA-2 Assimilation + CERES Satellite Observations',
    spatialResolution: '0.5° × 0.625° latitude/longitude (~50 km)',
    temporalResolution: 'Daily and Monthly Climatologies',
    temporalCoverage: '1981–present (Updated monthly)',
    variables: [
      '2-Meter Air Temperature (T2M, °C)',
      'Precipitation Rate (PRECTOTCORR, mm/day)',
      'Surface Solar Irradiance (ALLSKY_SFC_SW_DWN, kWh/m²/day)',
      'Relative Humidity & Wind Speed'
    ],
    accessMethod: 'Public REST API (No API key required)',
    apiEndpoint: 'https://power.larc.nasa.gov/api/temporal/monthly/point',
    citation: 'NASA Langley Research Center POWER Project. (2024). NASA POWER Climatology and Solar Resource API. Release 2.0.',
    license: 'NASA Open Data Policy (Public Domain / CC0 equivalent)',
    link: 'https://power.larc.nasa.gov/'
  },
  {
    id: 'nasa_gibs',
    name: 'NASA GIBS (Global Imagery Browse Services)',
    agency: 'NASA Earth Science Data and Information System (ESDIS)',
    missionOrModel: 'Terra, Aqua, Suomi NPP, NOAA-20, GPM, SMAP',
    spatialResolution: 'Native sensor resolution up to 250m per pixel (WMTS Web Mercator)',
    temporalResolution: 'Daily, 8-day, 16-day, and monthly composites',
    temporalCoverage: '2000–present',
    variables: [
      'MODIS Corrected Reflectance (True Color)',
      'MODIS Land Surface Temperature Day/Night',
      'VIIRS Nighttime Lights (Black Marble)',
      'GPM IMERG Rain Rate',
      'MODIS Sea Ice Concentration'
    ],
    accessMethod: 'OGC WMTS / WMS Public Tile Services (No key required)',
    apiEndpoint: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/',
    citation: 'NASA ESDIS. (2024). Global Imagery Browse Services (GIBS). NASA Earthdata.',
    license: 'Open Access for public research and education',
    link: 'https://www.earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs'
  },
  {
    id: 'nasa_cmr',
    name: 'NASA CMR (Common Metadata Repository)',
    agency: 'NASA Earthdata',
    missionOrModel: 'Catalog over all NASA EOSDIS Distributed Active Archive Centers (DAACs)',
    spatialResolution: 'Varies by mission granule',
    temporalResolution: 'Sub-daily to decadal',
    temporalCoverage: '1960s to present',
    variables: [
      'Metadata indexing for >34,000 Earth science datasets',
      'Granule search, polygon bounding box intersection, spatial filtering'
    ],
    accessMethod: 'Public JSON REST Search API',
    apiEndpoint: 'https://cmr.earthdata.nasa.gov/search/collections.json',
    citation: 'NASA Common Metadata Repository (CMR). NASA EOSDIS.',
    license: 'NASA Open Data Policy',
    link: 'https://cmr.earthdata.nasa.gov/'
  },
  {
    id: 'merra2',
    name: 'MERRA-2 Reanalysis',
    agency: 'NASA Goddard Space Flight Center (GSFC) / GMAO',
    missionOrModel: 'GEOS-5 Atmospheric Model & Gridpoint Statistical Interpolation (GSI)',
    spatialResolution: '0.5° × 0.625° latitude/longitude, 72 vertical levels',
    temporalResolution: 'Hourly, 3-hourly, and Monthly Means',
    temporalCoverage: '1980–present',
    variables: [
      'Surface and atmospheric temperatures',
      'Precipitation, specific humidity, sea level pressure',
      'Aerosol species: black carbon, dust, sea salt, sulfate'
    ],
    accessMethod: 'NASA GES DISC via Earthdata Login / OPeNDAP',
    apiEndpoint: 'https://disc.gsfc.nasa.gov/datasets?project=MERRA-2',
    citation: 'Gelaro, R., et al. (2017). The Modern-Era Retrospective Analysis for Research and Applications, Version 2 (MERRA-2). J. Climate, 30(14), 5419-5454.',
    license: 'Public Open Science Access',
    link: 'https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/'
  },
  {
    id: 'modis_terra_aqua',
    name: 'MODIS (Moderate Resolution Imaging Spectroradiometer)',
    agency: 'NASA GSFC / LP DAAC & LAADS DAAC',
    missionOrModel: 'Terra (EOS AM-1) & Aqua (EOS PM-1) Sun-synchronous satellites',
    spatialResolution: '250 m, 500 m, 1 km',
    temporalResolution: 'Daily swath to 16-day and monthly gridded composites',
    temporalCoverage: 'Terra: 2000–present / Aqua: 2002–present',
    variables: [
      'MOD13A2 / MYD13A2: NDVI and EVI Vegetation Indices',
      'MOD11A2: Land Surface Temperature & Emissivity',
      'MOD04_L2: Aerosol Optical Depth (550nm)',
      'MOD14A2: Thermal Anomalies & Wildfires'
    ],
    accessMethod: 'NASA Land Processes DAAC (LP DAAC) via CMR and AppEEARS',
    apiEndpoint: 'https://lpdaac.usgs.gov/products/mod13a2v061/',
    citation: 'Didan, K. (2021). MODIS/Terra Vegetation Indices 16-Day L3 Global 1km SIN Grid V061. NASA EOSDIS LP DAAC.',
    license: 'NASA Open Data Policy',
    link: 'https://modis.gsfc.nasa.gov/'
  },
  {
    id: 'gpm_imerg',
    name: 'GPM IMERG (Integrated Multi-satellitE Retrievals for GPM)',
    agency: 'NASA GSFC & JAXA',
    missionOrModel: 'GPM Core Observatory + international constellation microwave sensors',
    spatialResolution: '0.1° × 0.1° (~10 km × 10 km)',
    temporalResolution: '30-minute, daily, and monthly accumulations',
    temporalCoverage: 'June 2000–present',
    variables: [
      'Calibrated surface precipitation rate (mm/hr and mm/day)',
      'Precipitation phase (liquid, solid, mixed)'
    ],
    accessMethod: 'NASA GES DISC / Giovanni',
    apiEndpoint: 'https://gpm.nasa.gov/data/imerg',
    citation: 'Huffman, G. J., et al. (2020). The Integrated Multi-satellitE Retrievals for GPM (IMERG). Satellite Precipitation Measurement, 343-353.',
    license: 'Public Access',
    link: 'https://gpm.nasa.gov/'
  },
  {
    id: 'grace_fo',
    name: 'GRACE & GRACE Follow-On Satellite Gravimetry',
    agency: 'NASA JPL & German Research Centre for Geosciences (GFZ)',
    missionOrModel: 'Twin low-Earth orbit satellites measuring K-band / Laser distance shifts',
    spatialResolution: '300 km spatial resolving limit / 0.5° Mascon grid',
    temporalResolution: 'Monthly Mass Anomaly Grids',
    temporalCoverage: 'GRACE (2002–2017) and GRACE-FO (2018–present)',
    variables: [
      'Terrestrial Water Storage (TWS) anomalies (equivalent water cm)',
      'Deep aquifer storage depletion',
      'Ice sheet and glacier mass balance (Greenland, Antarctica)'
    ],
    accessMethod: 'NASA PO.DAAC / JPL Tellus Mascons',
    apiEndpoint: 'https://podaac.jpl.nasa.gov/dataset/TELLUS_GRAC-GRFO_MASCON_CRI_GRID_RL06.3_V4',
    citation: 'Watkins, M. M., et al. (2015). Improved methods for observing Earth’s time variable mass, J. Geophys. Res. Solid Earth, 120, 2648–2671.',
    license: 'NASA / JPL Open Data',
    link: 'https://grace.jpl.nasa.gov/'
  },
  {
    id: 'nsidc_sea_ice',
    name: 'NSIDC Sea Ice Index & Polar Microwave Products',
    agency: 'National Snow and Ice Data Center (NSIDC) / NASA Goddard DAAC',
    missionOrModel: 'DMSP SSM/I-SSMIS and Nimbus-7 SMMR',
    spatialResolution: '25 km polar stereographic grids',
    temporalResolution: 'Daily and Monthly Means',
    temporalCoverage: 'November 1978–present',
    variables: [
      'Northern and Southern Hemisphere Sea-Ice Extent (million km²)',
      'Sea-Ice Concentration (% pixel coverage)',
      'Ice-edge anomaly maps and departure statistics'
    ],
    accessMethod: 'NSIDC DAAC API and Earthdata Search',
    apiEndpoint: 'https://nsidc.org/data/seaice_index',
    citation: 'Fetterer, F., et al. (2017). Sea Ice Index, Version 3. Boulder, Colorado USA. NSIDC: National Snow and Ice Data Center.',
    license: 'NASA / NOAA Open Data Access',
    link: 'https://nsidc.org/'
  }
];
