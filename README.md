# TrendLens — Earth System Trend Detective

**NASA Space Apps Challenge Submission:** *Be An Earth System Trend Detective!*  
**Tagline:** *See Earth’s changes. Test their significance. Understand the connections.*

---

## 1. Overview & Scientific Mission

Environmental data is frequently misinterpreted. A single warm winter or a dry monsoon season can spark alarming claims that confuse natural climate variability with long-term planetary change. Furthermore, Earth is an interconnected thermodynamic system: warming can expand vegetation in high-latitude tundra while simultaneously triggering moisture stress and browning across Mediterranean scrublands.

**TrendLens** is a professional, data-driven web application designed to help researchers, students, educators, journalists, and citizens investigate long-term environmental trends backed by authentic NASA satellite observations.

TrendLens rigorously answers four questions for every analysis:
1. **What is changing?** (Earth-system variable, sensor, and physical unit)
2. **Where is it changing?** (Geographic region, bounding box, or custom probed coordinate)
3. **How much is it changing?** (Annual rate of change and percentage departure)
4. **Is the change statistically significant?** (Ordinary Least Squares regression and non-parametric Mann-Kendall trend testing)

---

## 2. Key Features

- **Interactive Trend Map with NASA GIBS:** Pan, zoom, and inspect global satellite base layers including NASA Blue Marble, MODIS True Color, and VIIRS Earth at Night.
- **Probe Any Coordinate on Earth:** Click directly on the Leaflet map to inspect the nearest observation grid cell and calculate localized trends.
- **Time-Series Analysis Engine:** Filter observations across 1981–2024 with monthly, seasonal, or annual aggregation. Toggle 12-month centered rolling means and deseasonalized baseline departures.
- **Non-Parametric Significance Testing:** Full mathematical implementation of the World Meteorological Organization (WMO) standard Mann-Kendall test ($S$, $\operatorname{Var}(S)$, $Z$, $\tau$, Sen's robust slope, and two-tailed $p$-values at 95% confidence).
- **Opposite-Trend Teleconnection Detector:** Side-by-side exploration of paired regional dynamics (e.g. Arctic Amplification vs. Southern Ocean Upwelling Buffering; Sahel Greening vs. Mediterranean Aridification).
- **Guided Trend Cases (Story Mode):** Six deep-dive investigations:
  1. *The Shrinking Arctic* (Sea-ice concentration & surface temperature)
  2. *Monsoon Variability* (South Asian precipitation volatility & vegetation response)
  3. *Fire, Smoke & Aerosol Loading* (Boreal wildfire outbreaks & MODIS AOD)
  4. *Oceans Under Pressure* (Sea-surface warming & marine heatwaves)
  5. *Greening vs. Browning Divergence* (High-latitude taiga vs drying scrub)
  6. *Water Beneath Our Feet* (GRACE-FO satellite gravimetry of deep aquifers)
- **Investigator Dashboard:** Personal workspace saving investigations, pinned regional watchlists, and export history.
- **Universal Login Modal:** Firebase Authentication supporting Google Sign-In, Email/Password, and 1-click Guest Detective sessions.
- **Export & Open Science:** Download observation series as CSV files with full sensor provenance or export chart views.

---

## 3. NASA Data Provenance & Real Data Strategy

TrendLens uses publicly accessible NASA Earth-observation records. **No fake or mock environmental records are used.**

| Variable | NASA Mission / Sensor | Resolution | Access Endpoint |
| :--- | :--- | :--- | :--- |
| **Surface Air Temperature** | MERRA-2 / NASA POWER | 0.5° × 0.625° | NASA POWER Public REST API (`T2M`) |
| **Precipitation Rate** | GPM IMERG / MERRA-2 | 0.1° (~10 km) | NASA POWER Public REST API (`PRECTOTCORR`) |
| **Polar Sea-Ice Concentration** | NSIDC / NASA Goddard (SSMIS) | 25 km grid | NSIDC DAAC / NASA GIBS Tile Feed |
| **Vegetation Index (NDVI)** | MODIS Terra (MOD13A2) | 1 km / 250 m | NASA LP DAAC via CMR & Earthdata |
| **Aerosol Optical Depth (AOD)** | MODIS Terra/Aqua (MOD04_L2) | 1° / 10 km | NASA Giovanni / GES DISC / GIBS |
| **Groundwater Storage (TWS)** | GRACE & GRACE Follow-On | 300 km (0.5° Mascon) | NASA PO.DAAC / JPL Tellus Mascons |
| **Solar Surface Insolation** | NASA CERES & POWER | 1° / 0.5° | NASA POWER REST API (`ALLSKY_SFC_SW_DWN`) |

---

## 4. Technology Stack & Architecture

```
trendlens/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Navbar, Footer, LoginModal, ExplanationDrawer
│   │   │   ├── charts/           # TimeSeriesChart, MiniSparkline
│   │   │   └── maps/             # TrendMap (Leaflet + NASA GIBS WMTS)
│   │   ├── data/                 # Variables, Regions, Curated series, Trend cases
│   │   ├── pages/                # Home, About, Features, Analyze, Cases, Sources, Dashboard
│   │   ├── services/             # NASA POWER client, Statistics engine, Firebase auth, Storage
│   │   └── types/                # TypeScript interfaces
├── backend/                      # Python FastAPI Analytical Microservice
│   ├── app/
│   │   ├── analysis/             # NumPy/SciPy OLS and Mann-Kendall statistics
│   │   ├── data_sources/         # Asynchronous NASA POWER and CMR clients
│   │   ├── api/                  # REST endpoints (/analyze, /nasa/power, /nasa/cmr)
│   │   └── main.py               # FastAPI application setup & CORS
│   └── requirements.txt          # Python dependencies
├── .env.example                  # Environment configuration template
└── README.md
```

---

## 5. How to Run Locally

### Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend (Python FastAPI - Optional)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
4. Explore interactive API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 6. Scientific Caution & Non-Causal Policy

In accordance with NASA Earth System Science guidelines:
> *Never present statistical correlation as proof of direct causation.*

TrendLens automatically annotates all statistical results with contextual interpretive notes:
- *"This pattern is consistent with persistent regional environmental forcing; further multi-variate modeling is required to evaluate specific physical drivers."*
- *"A possible contributing factor is long-term atmospheric circulation changes; never present correlation as proof of direct causation."*

---

## 7. License

Built for the **NASA Space Apps Challenge 2026**.  
Distributed under the **MIT License**. All NASA datasets are subject to the **NASA Earth Science Open Data Policy**.
