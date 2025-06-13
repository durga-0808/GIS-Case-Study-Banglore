import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Overlay from "ol/Overlay";
import GeoJSON from "ol/format/GeoJSON";
import TileWMS from "ol/source/TileWMS";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import Cluster from "ol/source/Cluster";
import {
    Stroke,
    Fill,
    Style,
    Circle as CircleStyle,
    Text,
    Icon,
} from "ol/style";
import SchoolIcon from "../assets/school-icon.png";
import InfoIcon from "../assets/info-icon.png";
import DemIcon from "../assets/dem.png";
import { Select } from "ol/interaction";
import { click } from "ol/events/condition";
import { booleanPointInPolygon } from "@turf/turf";
import { fromLonLat, transform } from "ol/proj";
// import { transformExtent } from "ol/proj";
// import GeoTIFF from "geotiff";
// import { bbox as turfBbox, polygon as turfPolygon } from '@turf/turf';


const MapView = ({ setTreeData, setSchoolData, setElevationData }) => {
    const mapRef = useRef();
    const popupRef = useRef();
    const popupContentRef = useRef();

    const [mapObj, setMapObj] = useState(null);
    const [wardLayer, setWardLayer] = useState(null);
    const [treeLayer, setTreeLayer] = useState(null);
    const [schoolLayer, setSchoolLayer] = useState(null);
    const [demLayer, setDemLayer] = useState(null);
    const [showWards, setShowWards] = useState(true);
    const [showSchools, setShowSchools] = useState(true);
    const [showTrees, setShowTrees] = useState(false);
    const [showDem, setShowDem] = useState(true);
    const [showLegend, setShowLegend] = useState(false);

   
    useEffect(() => {
        const baseLayer = new TileLayer({ source: new OSM() });

        const map = new Map({
            target: mapRef.current,
            layers: [baseLayer],
            view: new View({
                center: fromLonLat([77.5946, 12.9716]),
                zoom: 11,
            }),
        });

        // DEM Layer
        const demWmsLayer = new ImageLayer({
            source: new ImageWMS({
                url: "http://localhost:8080/geoserver/bengaluru/wms",
                params: {
                    LAYERS: "bengaluru:merged",
                    TILED: true,
                },
                ratio: 1,
                serverType: "geoserver",
            }),
            visible: true,
        });
        map.addLayer(demWmsLayer);
        setDemLayer(demWmsLayer);

        // Ward Layer
        const wLayer = new VectorLayer({
            source: new VectorSource({
                url: "/data/ward.geojson",
                format: new GeoJSON(),
            }),
            style: new Style({
                stroke: new Stroke({ color: "blue", width: 2 }),
                fill: new Fill({ color: "rgba(0,0,255,0.1)" }),
            }),
            visible: true,
        });
        map.addLayer(wLayer);
        setWardLayer(wLayer);

        // Tree Layer (WMS)
        const tLayer = new TileLayer({
            source: new TileWMS({
                url: "http://localhost:8080/geoserver/bengaluru/wms",
                params: {
                    LAYERS: "bengaluru:trees",
                    TILED: true,
                },
                ratio: 1,
                serverType: "geoserver",
            }),
            visible: false,
        });
        map.addLayer(tLayer);
        setTreeLayer(tLayer);

        // School Clustering Layer
        const schoolSource = new VectorSource({
            url: "/data/school.geojson",
            format: new GeoJSON(),
        });

        const clusterSource = new Cluster({
            distance: 40,
            source: schoolSource,
        });

        const schoolClusterLayer = new VectorLayer({
            source: clusterSource,
            style: (feature) => {
                const size = feature.get("features").length;
                return size > 1
                    ? new Style({
                        image: new CircleStyle({
                            radius: 20,
                            fill: new Fill({ color: "#FF9800" }),
                            stroke: new Stroke({ color: "#fff", width: 1 }),
                        }),
                        text: new Text({
                            text: size.toString(),
                            fill: new Fill({ color: "#fff" }),
                            font: "12px sans-serif",
                        }),
                    })
                    : new Style({
                        image: new Icon({
                            src: SchoolIcon,
                            scale: 0.06,
                        }),
                    });
            },
            visible: true,
        });
        map.addLayer(schoolClusterLayer);
        setSchoolLayer(schoolClusterLayer);

        // Popup Overlay
        const overlay = new Overlay({
            element: popupRef.current,
            autoPan: { animation: { duration: 250 } },
        });
        map.addOverlay(overlay);

        map.on("pointermove", (evt) => {
            if (evt.dragging) return;

            const features = map.getFeaturesAtPixel(evt.pixel);
            map.getViewport().style.cursor = features && features.length > 0 ? 'pointer' : '';


            if (features && features.length > 0) {
                const feature = features[0];
                let html = "<table>";

                const clusterFeatures = feature.get("features");
                if (Array.isArray(clusterFeatures)) {
                    if (clusterFeatures.length === 1) {
                        const school = clusterFeatures[0];
                        const props = { ...school.getProperties() };
                        delete props.geometry;

                        Object.entries(props).forEach(([key, value]) => {
                            html += `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
                        });
                    } else {
                        html += `<tr><td colspan="2"><strong>${clusterFeatures.length} Schools in this cluster:</strong></td></tr>`;
                        clusterFeatures.forEach((school, index) => {
                            const name = school.get("SchoolName") || `School ${index + 1}`;
                            html += `<tr><td colspan="2">${name}</td></tr>`;
                        });
                    }
                } else {
                    const props = { ...feature.getProperties() };
                    delete props.geometry;

                    Object.entries(props).forEach(([key, value]) => {
                        html += `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
                    });
                }

                html += "</table>";
                popupContentRef.current.innerHTML = html;
                overlay.setPosition(evt.coordinate);
            } else {
                overlay.setPosition(undefined);
            }
        });

        // Ward click selection
        const wardSelect = new Select({ layers: [wLayer], condition: click });
        map.addInteraction(wardSelect);

        wardSelect.on("select", async (e) => {
            const selectedFeature = e.selected[0];
            if (!selectedFeature) {
                setTreeData([]);
                setSchoolData(0);
                setElevationData("N/A");
                return;
            }

            const geoFormat = new GeoJSON();
            const wardGeoJSON = geoFormat.writeFeatureObject(selectedFeature);

            // elevation
            const ward_name = {
                "ward_name": selectedFeature.values_.KGISWardName,
            }
            console.log("wardname", ward_name)
            try {
                const response = await fetch("http://localhost:5001/average-elevation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(ward_name)
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
               
                const avgElevation = result;

                setElevationData(avgElevation); 
            } catch (error) {
                console.error("Error fetching elevation data:", error);
               
            }



            try {
                const response = await fetch("http://localhost:5001/filter-points-by-ward", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(ward_name)
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const treesInWard = await response.json();             
                const features = treesInWard.features || [];
                const counts = {};
                features.forEach((feature) => {
                    if (feature.type !== "Feature") return;

                    const treeName = feature.properties?.TreeName?.trim() || "Unknown";

                    counts[treeName] = (counts[treeName] || 0) + 1;
                });
                const formattedData = Object.entries(counts).map(([name, value]) => ({
                    name,
                    value,
                }));

                setTreeData(formattedData);

            } catch (err) {
                console.error("Tree filtering failed:", err);
                setTreeData([]);
            }


            // Filter schools in ward
            const schoolFeatures = schoolSource.getFeatures();
            const schoolsInWard = schoolFeatures.filter((school) =>
                booleanPointInPolygon(
                    geoFormat.writeFeatureObject(school).geometry,
                    wardGeoJSON.geometry
                )
            );
            setSchoolData(schoolsInWard.length);



        });

        setMapObj(map);

        return () => {
            map.setTarget(null);
            map.removeInteraction(wardSelect);
            map.removeOverlay(overlay);
        };
    }, []);

   

    return (
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
            <div id="popup" className="ol-popup" style={popupStyle} ref={popupRef}>
                <div id="popup-content" ref={popupContentRef}></div>
            </div>
            <div style={controlBoxStyle}>
                <strong>Layers</strong>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={showSchools}
                            onChange={() => {
                                schoolLayer.setVisible(!showSchools);
                                setShowSchools(!showSchools);
                            }}
                        />
                        Schools
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={showTrees}
                            onChange={() => {
                                treeLayer.setVisible(!showTrees);
                                setShowTrees(!showTrees);
                            }}
                        />
                        Trees
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={showWards}
                            onChange={() => {
                                wardLayer.setVisible(!showWards);
                                setShowWards(!showWards);
                            }}
                        />
                        Wards
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={showDem}
                            onChange={() => {
                                demLayer.setVisible(!showDem);
                                setShowDem(!showDem);
                            }}
                        />
                        DEM
                    </label>
                </div>
            </div>
            {/* Toggle Button */}
            <button
                onClick={() => setShowLegend(!showLegend)}
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    zIndex: 1001,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(25, 118, 210, 0.85)", 
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    fontWeight: 500,
                    fontSize: "14px",
                    backdropFilter: "blur(4px)",
                    transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(25, 118, 210, 1)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(25, 118, 210, 0.85)")
                }
            >
                Legend {" "}
                <img
                    src={InfoIcon}
                    alt="Info"
                    style={{ width: 18, height: 18, filter: "invert(100%)" }}
                />
            </button>

            {showLegend && (
                <div style={legendStyle}>
                   
                    <div style={legendItemStyle}>
                        <img
                            src={SchoolIcon}
                            alt="School"
                            style={{ width: 20, height: 20, marginRight: 8 }}
                        />
                        <span>School</span>
                    </div>
                    <div style={legendItemStyle}>
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: "rgba(0,0,255,0.5)",
                                border: "1px solid blue",
                                marginRight: 8,
                            }}
                        />
                        <span>Ward Boundary</span>
                    </div>
                    <p > DEM Elevations</p>
                    <div style={legendItemStyle}>
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#440154",
                                border: "1px solid #33004d",
                                marginRight: 8,
                            }}
                        />
                        <span>&lt; 800m</span>
                    </div>

                    <div style={legendItemStyle}>
                       
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#3B528B",
                                border: "1px solid #2a3d66",
                                marginRight: 8,
                            }}
                        />
                        <span>&lt; 850m</span>
                    </div>

                    <div style={legendItemStyle}>
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#FDE725",
                                border: "1px solid #cccc00",
                                marginRight: 8,
                            }}
                        />
                        <span>&lt; 900m</span>
                    </div>

                    <div style={legendItemStyle}>
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#F03B20",
                                border: "1px solid #cc2e15",
                                marginRight: 8,
                            }}
                        />
                        <span>&lt; 950m</span>
                    </div>

                    <div style={legendItemStyle}>
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#C51B7D",
                                border: "1px solid #99155e",
                                marginRight: 8,
                            }}
                        />
                        <span>&lt; 1000m</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const controlBoxStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "white",
    padding: "10px 14px",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    fontSize: "14px",
    zIndex: 1000,
};

const popupStyle = {
    position: "absolute",
    backgroundColor: "white",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #cccccc",
    bottom: "12px",
    left: "12px",
    minWidth: "200px",
    zIndex: 1001,
};

const legendStyle = {
    position: "absolute",
    bottom: "60px",
    left: "20px",
    backgroundColor: "white",
    padding: "10px 14px",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    fontSize: "14px",
    zIndex: 1000,
};

const legendItemStyle = {
    display: "flex",
    alignItems: "center",
    marginTop: "6px",
};

export default MapView;
