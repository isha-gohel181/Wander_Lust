import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Create custom red icon
const redIcon = new Icon({
  iconUrl: "/marker-icon-red.png",
  iconRetinaUrl: "/marker-icon-2x-red.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapController = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const LeafletMap = ({
  center,
  zoom = 13,
  markerPosition,
  onMarkerDragEnd,
  height = "400px",
  draggable = false,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%" }}
      className="rounded-lg"
    >
      <MapController center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker
          position={markerPosition}
          draggable={draggable}
          icon={redIcon}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              onMarkerDragEnd?.({
                latLng: {
                  lat: () => position.lat,
                  lng: () => position.lng,
                },
              });
            },
          }}
        >
          <Popup>Selected location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default React.memo(LeafletMap);
