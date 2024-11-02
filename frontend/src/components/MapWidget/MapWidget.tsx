import React, { FC } from 'react';
import styles from './MapWidget.module.scss';
import { Box, Text } from '@chakra-ui/react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapWidgetProps {
  position?: [number, number];
  zoom?: number;
}

const MapWidget: FC<MapWidgetProps> = ({ position = [40.7128, -74.006], zoom = 13 }) => {
  return (
    <MapContainer center={position} zoom={zoom} style={{ height: '280px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>A sample popup</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapWidget;
