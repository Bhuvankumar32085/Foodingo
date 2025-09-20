import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [20, 20],
  iconAnchor: [20, 40],
});
const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [20, 20],
  iconAnchor: [20, 40],
});

const DeliveryBoyTraking = ({ data }) => {
  const deliveryLatitude = data?.deliveryBoyLocation?.lat;
  const deliveryLongitude = data?.deliveryBoyLocation?.lon;
  const custometLatitude = data?.customerBoyLocation?.lat;
  const customerLongitude = data?.customerBoyLocation?.lon;

  // Agar lat/lng available nahi hain → Map render hi mat karo
  if (
    !deliveryLatitude ||
    !deliveryLongitude ||
    !custometLatitude ||
    !customerLongitude
  ) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-xl shadow-md">
        <p className="text-gray-500">Location data not available</p>
      </div>
    );
  }

  const path = [
    [deliveryLatitude, deliveryLongitude],
    [custometLatitude, customerLongitude],
  ];

  const center = [deliveryLatitude, deliveryLongitude];

  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer className="w-full h-full" center={center} zoom={16}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker
          position={[deliveryLatitude, deliveryLongitude]}
          icon={deliveryBoyIcon}
        >
          <Popup>Delivery Boy</Popup>
        </Marker>
        <Marker
          position={[custometLatitude, customerLongitude]}
          icon={customerIcon}
        >
          <Popup>Customer</Popup>
        </Marker>
        <Polyline positions={path} color="orange" weight={4}></Polyline>
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTraking;
