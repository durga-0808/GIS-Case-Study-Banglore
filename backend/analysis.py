from flask import Flask, request, jsonify
from flask_cors import CORS 
import rasterio
import rasterio.mask
import numpy as np
import geopandas as gpd
import json

app = Flask(__name__)
CORS(app, origins=["*"]) 

# Path to your GeoTIFF file
TIF_PATH = "../data/DEM/nasadem_bengaluru/merged.tif"
# GeoJSON file with point data
Trees_GEOJSON = "../data/trees/merged.geojson" 
WARD_GEOJSON = "../data/ward.geojson" 

# Load ward boundaries once at startup
wards_gdf = gpd.read_file(WARD_GEOJSON)
points_gdf = gpd.read_file(Trees_GEOJSON)

# --- API 1: Average Elevation for Ward ---
@app.route("/average-elevation", methods=["POST"])
def average_elevation():
    try:
        data = request.get_json()
        ward_name = data.get("ward_name")

        if not ward_name:
            return jsonify({"error": "Missing 'ward_name' in request body"}), 400

        matching_wards = wards_gdf[wards_gdf["KGISWardName"].str.lower() == ward_name.lower()]
        if matching_wards.empty:
            return jsonify({"error": f"Ward '{ward_name}' not found"}), 404

        ward_geometry = matching_wards.geometry.values

        with rasterio.open(TIF_PATH) as src:
            out_image, _ = rasterio.mask.mask(src, ward_geometry, crop=True)
            out_image = out_image[0]
            valid_data = out_image[out_image != src.nodata]

            if valid_data.size == 0:
                return jsonify({"message": "No elevation data in ward"}), 404

            average = float(np.mean(valid_data))
            return jsonify({
                "ward_name": ward_name,
                "average_elevation_m": round(average, 2)
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- API 2: Filter Points Inside a Ward ---
@app.route("/filter-points-by-ward", methods=["POST"])
def filter_points():
    try:
        data = request.get_json()
        ward_name = data.get("ward_name")

        if not ward_name:
            return jsonify({"error": "Missing 'ward_name' in request body"}), 400

        matching_wards = wards_gdf[wards_gdf["KGISWardName"].str.lower() == ward_name.lower()]
        if matching_wards.empty:
            return jsonify({"error": f"Ward '{ward_name}' not found"}), 404

        ward_polygon = matching_wards.unary_union

        points_in_crs = points_gdf.to_crs(wards_gdf.crs) if points_gdf.crs != wards_gdf.crs else points_gdf
        filtered_points = points_in_crs[points_in_crs.within(ward_polygon)]

        if filtered_points.empty:
            return jsonify({"message": "No points found in this ward"}), 404

        return jsonify(json.loads(filtered_points.to_json()))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="localhost", port=5001, debug=True)

