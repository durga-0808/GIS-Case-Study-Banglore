
# 🌍 Bengaluru GIS Web Application

This project is a full-stack geospatial application that visualizes and analyzes environmental and infrastructure data for Bengaluru. It integrates vector and raster datasets, performs backend geospatial analysis, and provides interactive map-based insights through a web frontend.

---

## 🛠️ Technologies Used

### Backend:
- **Python** (FastAPI / Flask)
- **GeoPandas**, **Shapely**, **Rasterio**, **Fiona**
- **Overpass API** for school data
- **pystac_client**, **planetary_computer** for DEM

### Frontend:
- **React JS**
- **OpenLayers** (for map rendering)
- **Chart.js** or similar for pie charts

### GIS Server:
- **GeoServer**
  - Vector and raster layer publishing
  - SLD styling for color-coded maps

---

## ⚙️ Setup Instructions

### 🔧 1. GeoServer
- Download and install GeoServer
- Upload and publish layers (trees, DEM)
  - tree layer: `/data/trees/shapefile/merged.shp`
  - DEM layer: `/data/DEM/nasadem_bengaluru/merged.tif`
- Apply SLD styles:
  - `/data/trees/styles/trees_style.sld`
  - `/data/DEM/style.xml`

### 🔧 2. Backend (Python)
```bash
cd backend/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 analysis.py
```

### 🔧 3. Frontend (React)
```bash
cd frontend/
npm install
npm start
```
##  Download the data folder from the below drive link
https://drive.google.com/file/d/1NoVYFPw_PXFJbNIBrw2iQQlkgfo1_BSx/view?usp=sharing

---

## 🌐 Data Sources

- Tree Census: [OpenCity Bengaluru Tree Census](https://data.opencity.in/dataset/bengaluru-tree-census-data)
- Ward Boundaries: [Datameet - Bengaluru Wards](https://github.com/datameet/Municipal_Spatial_Data)
- Schools (Overpass API): [Overpass Turbo](https://overpass-turbo.eu/)
- DEM (NASADEM): [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com)

---
