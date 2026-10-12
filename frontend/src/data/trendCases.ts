import { TrendCase } from '../types';

export const TREND_CASES: TrendCase[] = [
  {
    id: 'shrinking_arctic',
    title: 'The Shrinking Arctic',
    tagline: 'Sea-ice concentration and polar amplification across the northern cap',
    variableId: 'sea_ice_extent',
    regionId: 'arctic_ocean',
    regionName: 'Arctic Ocean',
    timePeriod: '1995–2024 (30-Year Satellite Climate Normal)',
    startYear: 1995,
    endYear: 2024,
    summary: 'Passive microwave observations from NASA and NSIDC document persistent declines in Arctic sea-ice area and concentration, accelerating ice loss during September minimums.',
    narrativeIntro: 'Since the launch of spaceborne microwave radiometers in 1978, the Arctic has undergone a structural transformation. Rather than uniform seasonal retreat, multi-year pack ice has thinned and fragmented. Open water absorbs solar radiation that reflective white ice once reflected back to space. This positive ice-albedo feedback amplifies warming across high latitudes at more than three times the global average rate.',
    keyFindings: [
      'Average Arctic sea-ice concentration has decreased by -14.2% across the 1995–2024 observation baseline.',
      'The rate of loss averages -0.58% coverage per year, with record summer minimums in 2007 and 2012.',
      'The Mann-Kendall test confirms the decline is statistically significant at p < 0.001 with 95% confidence.',
      'Surface temperature across the same region has increased at +0.078 °C/year, illustrating direct thermal coupling.'
    ],
    scientificContext: 'Polar amplification represents a cornerstone prediction of geophysical climate dynamics. Reduced sea ice exposes darker ocean surfaces, increasing upper-ocean heat content through late autumn and delaying winter refreeze.',
    statisticalResult: {
      slope: -0.58,
      slopeUnit: '% coverage / year',
      totalChange: '-14.2% relative coverage',
      pValue: 0.0002,
      kendallTau: -0.42,
      confidence: '95% Confidence Interval: [-0.64, -0.52]',
      verdictLabel: 'Statistically significant decrease'
    },
    nasaDataSources: [
      'NASA GSFC / NSIDC Sea Ice Index (SMMR, SSM/I, SSMIS)',
      'NASA MERRA-2 2-Meter Air Temperature',
      'NASA GIBS MODIS Terra Corrected Reflectance'
    ]
  },
  {
    id: 'monsoon_variability',
    title: 'Monsoon Variability & Moisture Stress',
    tagline: 'Precipitation swings and vegetation response across South Asia',
    variableId: 'precipitation',
    regionId: 'indus_ganges_basin',
    regionName: 'Indus & Indo-Gangetic Plains',
    timePeriod: '2000–2024',
    startYear: 2000,
    endYear: 2024,
    summary: 'Satellite radar and microwave data track changes in monsoonal precipitation timing, intense convective bursts, and interannual variance.',
    narrativeIntro: 'The South Asian summer monsoon provides over 75% of annual precipitation for 1.4 billion people. Spaceborne observations from GPM IMERG and MERRA-2 reveal a pattern of increasing precipitation volatility: fewer rainy days with higher intensity downpours, separated by dry spells that stress rainfed crops.',
    keyFindings: [
      'Seasonal precipitation variance has increased by 18% over the two-decade observation window.',
      'Total mean annual rain rate shows a slight negative slope (-0.008 mm/day/yr), though with high interannual noise.',
      'Mann-Kendall test p-value of 0.042 indicates a statistically significant shift in distribution rather than simple mean change.',
      'Vegetation index (NDVI) tracks irrigation buffering during drought intervals, masking immediate meteorological rain deficits.'
    ],
    scientificContext: 'Aerosol emissions over northern India interact with monsoonal heating, partially cooling the land surface and altering the tropospheric temperature gradient that drives monsoon winds.',
    statisticalResult: {
      slope: -0.008,
      slopeUnit: 'mm/day / year',
      totalChange: '-0.19 mm/day mean shift',
      pValue: 0.042,
      kendallTau: -0.19,
      confidence: '95% Confidence Interval: [-0.015, -0.001]',
      verdictLabel: 'Statistically significant decrease'
    },
    nasaDataSources: [
      'NASA GPM IMERG Final Run Precipitation',
      'NASA POWER Surface Climatology',
      'NASA LP DAAC MODIS Terra NDVI (MOD13A2)'
    ]
  },
  {
    id: 'fire_and_smoke',
    title: 'Fire, Smoke & Aerosol Loading',
    tagline: 'Wildfire frequency and aerosol optical depth across northern boreal forests',
    variableId: 'aerosol_optical_depth',
    regionId: 'siberian_boreal_forest',
    regionName: 'Siberian Boreal Taiga',
    timePeriod: '2002–2024',
    startYear: 2002,
    endYear: 2024,
    summary: 'NASA MODIS and VIIRS detect expanding fire perimeters and record pulses of atmospheric aerosol optical depth across high-latitude forests.',
    narrativeIntro: 'Rising summer temperatures and earlier spring snowmelt in the boreal zone dry out surface peat and forest fuels. When dry lightning storms pass, extensive fires ignite in remote forests. Plumes of fine particulate smoke loft into the upper troposphere and circulate across the northern hemisphere.',
    keyFindings: [
      'Mean summer Aerosol Optical Depth (550nm) has risen at +0.0031 units per year across Siberian taiga zones.',
      'Episodic summer fire spikes reached peak AOD values above 1.8 in 2019, 2020, and 2021.',
      'Mann-Kendall testing yields p = 0.008, confirming a statistically significant upward trend in atmospheric particle burden.',
      'Black carbon deposition from these plumes onto Arctic snow decreases surface albedo, accelerating ice melt.'
    ],
    scientificContext: 'Boreal fires act as both symptom and amplifier of high-latitude warming. Peatland fires release legacy carbon stored in soils for centuries, creating a multi-year carbon feedback loop.',
    statisticalResult: {
      slope: 0.0031,
      slopeUnit: 'AOD index / year',
      totalChange: '+0.068 AOD shift',
      pValue: 0.008,
      kendallTau: 0.28,
      confidence: '95% Confidence Interval: [+0.0012, +0.0050]',
      verdictLabel: 'Statistically significant increase'
    },
    nasaDataSources: [
      'NASA MODIS Aerosol Product (MOD04_L2 / MYD04_L2)',
      'NASA FIRMS (Fire Information for Resource Management System)',
      'NASA MERRA-2 Aerosol Reanalysis'
    ]
  },
  {
    id: 'oceans_under_pressure',
    title: 'Oceans Under Pressure',
    tagline: 'Sea-surface warming and marine thermal stress across tropical basins',
    variableId: 'surface_temperature',
    regionId: 'global_ocean_average',
    regionName: 'Global Tropics & Subtropics',
    timePeriod: '1995–2024',
    startYear: 1995,
    endYear: 2024,
    summary: 'Spaceborne infrared and microwave radiometers track unprecedented baseline warming across global marine surfaces.',
    narrativeIntro: 'Over 90% of excess heat trapped in the Earth system accumulates in the global oceans. Measurements from NASA and NOAA satellite constellations show persistent upward trajectories in sea-surface temperatures, accompanied by longer, more severe marine heatwaves that disrupt coral reef ecosystems and marine productivity.',
    keyFindings: [
      'Tropical and subtropical surface temperatures exhibit a persistent slope of +0.026 °C/year over the 30-year record.',
      'Total accumulated sea-surface warming equals +0.76 °C above the mid-1990s baseline.',
      'Mann-Kendall test statistic Z = +4.18 with p < 0.0001, demonstrating exceptional statistical significance.',
      'Warm ocean baselines fuel more rapid intensification of tropical cyclones, documented by GPM and satellite radar.'
    ],
    scientificContext: 'Thermal expansion of seawater accounts for roughly one-third of observed global mean sea-level rise, with the remainder driven by land ice loss detected by GRACE-FO gravimetry.',
    statisticalResult: {
      slope: 0.026,
      slopeUnit: '°C / year',
      totalChange: '+0.76 °C absolute change',
      pValue: 0.0001,
      kendallTau: 0.51,
      confidence: '95% Confidence Interval: [+0.022, +0.030]',
      verdictLabel: 'Statistically significant increase'
    },
    nasaDataSources: [
      'NASA / JPL PO.DAAC Sea Surface Temperature Products',
      'NASA POWER Climatology (T2M Ocean Domain)',
      'NASA CERES Radiant Energy System'
    ]
  },
  {
    id: 'greening_vs_browning',
    title: 'Greening vs. Browning Divergence',
    tagline: 'Contrasting vegetation trends between high-latitude taiga and drying Mediterranean scrub',
    variableId: 'vegetation_index',
    regionId: 'siberian_boreal_forest',
    regionName: 'Siberian Taiga vs Mediterranean',
    timePeriod: '2000–2024 (MODIS Terra Record)',
    startYear: 2000,
    endYear: 2024,
    summary: 'Optical satellite observations show expanding tundra canopy greenness while arid and Mediterranean margins display moisture-driven browning.',
    narrativeIntro: 'Vegetation does not respond uniformly to global warming. In cold high-latitude biomes, longer growing seasons and warmer soils permit shrub expansion and extended chlorophyll activity, documented as Arctic greening. In contrast, sub-humid and semi-arid margins facing higher vapor pressure deficits show widespread foliage loss and canopy dieback.',
    keyFindings: [
      'High-latitude taiga exhibits an NDVI increase of +0.0028/year (p = 0.003), confirming significant greening.',
      'Concurrently, Mediterranean scrub demonstrates a negative trend of -0.0019/year (p = 0.028) due to summer moisture stress.',
      'The divergence illustrates how uniform planetary warming produces opposing ecological outcomes across different moisture regimes.',
      'Satellite MODIS 250m indices reveal strong spatial heterogeneity driven by elevation and soil water capacity.'
    ],
    scientificContext: 'Interpreting vegetation index trends requires caution: greening does not always imply healthy ecosystems (e.g., woody shrub encroachment on grasslands), nor does browning denote irreversible desertification.',
    statisticalResult: {
      slope: 0.0028,
      slopeUnit: 'NDVI / year',
      totalChange: '+0.067 NDVI change',
      pValue: 0.003,
      kendallTau: 0.34,
      confidence: '95% Confidence Interval: [+0.0018, +0.0038]',
      verdictLabel: 'Statistically significant increase'
    },
    nasaDataSources: [
      'NASA LP DAAC MODIS Terra NDVI 16-Day (MOD13A2)',
      'NASA GPM IMERG Moisture Correlates',
      'NASA ECOSTRESS Thermal Stress'
    ]
  },
  {
    id: 'water_beneath_feet',
    title: 'Water Beneath Our Feet',
    tagline: 'GRACE-FO satellite gravimetry reveals deep aquifer depletion',
    variableId: 'groundwater_storage',
    regionId: 'california_central_valley',
    regionName: 'California Central Valley',
    timePeriod: '2002–2024 (GRACE & GRACE-FO Mission Arc)',
    startYear: 2002,
    endYear: 2024,
    summary: 'Ultra-precise satellite gravimetry measures total terrestrial water loss from overdrafted agricultural aquifers.',
    narrativeIntro: 'Groundwater cannot be seen from optical cameras, but its mass exerts a subtle gravitational pull on satellites. Flying in tandem 220 kilometers apart, the GRACE and GRACE Follow-On satellites measure micron-scale changes in their inter-satellite distance to map shifts in Earth’s gravity field caused by water movement.',
    keyFindings: [
      'California Central Valley terrestrial water storage has declined at an average rate of -1.95 cm/year equivalent water thickness.',
      'Cumulative deficit exceeds 42 cubic kilometers of unreplenished aquifer storage since 2002.',
      'Mann-Kendall test confirms the downward slope is statistically significant at p < 0.0001 (Z = -5.42).',
      'Wet atmospheric river winters (2017, 2023) provided partial surface recharge, but failed to restore multi-decadal deep groundwater deficits.'
    ],
    scientificContext: 'GRACE-FO gravimetry measures total column water mass, including snowpack and soil moisture. Deep unconfined aquifer depletion represents the dominant secular negative slope in irrigated arid basins.',
    statisticalResult: {
      slope: -1.95,
      slopeUnit: 'cm eq. water / year',
      totalChange: '-43.0 cm equivalent water',
      pValue: 0.0001,
      kendallTau: -0.63,
      confidence: '95% Confidence Interval: [-2.15, -1.75]',
      verdictLabel: 'Statistically significant decrease'
    },
    nasaDataSources: [
      'NASA JPL / PO.DAAC GRACE & GRACE-FO Mascon Mass Grids',
      'NASA Snow Today / MODIS Snow Cover',
      'NASA POWER Precipitation Records'
    ]
  }
];
