import React, { FC, useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { Arrival, getPolylinesAlongRoute } from '../BusStopDashboard/BusStopDashboard';
import { createStationIcon } from '../MapWidget/MapWidget';

const tileLayerUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAPS_API_KEY}`;
const tileLayerAttribution = `'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'`;

const createLabeledBusIcon = (routeShortName: string): L.DivIcon =>
  L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:1px;">
        <div style="background:#cc0000;color:white;font-size:10px;font-weight:bold;
                    font-family:Helvetica,Arial,sans-serif;padding:1px 4px;
                    border-radius:3px;white-space:nowrap;
                    box-shadow:0 1px 3px rgba(0,0,0,0.5);">${routeShortName}</div>
        <div style="color:#cc0000;font-size:20px;line-height:1;
                    filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));">&#9650;</div>
      </div>`,
    iconSize: [40, 36],
    iconAnchor: [20, 36],
  });

const MapBoundsSetter: FC<{ positions: LatLngTuple[] }> = ({ positions }) => {
  const map = useMap();
  const hasFit = useRef(false);
  useEffect(() => {
    if (!hasFit.current && positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
      hasFit.current = true;
    }
  }, [positions, map]);
  return null;
};

interface DashboardMapProps {
  stopMonitoringData: Record<string, Arrival[]>;
  stationPosition?: [number, number];
}

const DashboardMap: FC<DashboardMapProps> = ({ stopMonitoringData, stationPosition }) => {
  const [routePolylines, setRoutePolylines] = useState<Record<string, LatLngTuple[]>>({});

  useEffect(() => {
    const missingRoutes = Object.keys(stopMonitoringData).filter(r => !routePolylines[r]);
    if (missingRoutes.length === 0) return;
    Promise.all(missingRoutes.map(async id => ({ id, poly: await getPolylinesAlongRoute(id) })))
      .then(results => setRoutePolylines(prev => {
        const next = { ...prev };
        results.forEach(({ id, poly }) => { if (poly) next[id] = poly as LatLngTuple[]; });
        return next;
      }));
  }, [stopMonitoringData]); // intentionally excludes routePolylines to avoid infinite loop

  const allPositions: LatLngTuple[] = [
    ...(stationPosition ? [stationPosition as LatLngTuple] : []),
    ...Object.values(stopMonitoringData).flat().map(
      a => [a.vehicleLat, a.vehicleLon] as LatLngTuple
    ),
  ];

  return (
    <Box h="100%" w="100%">
      <MapContainer
        center={stationPosition ?? [40.7580, -73.9855]}
        zoom={14}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
        {stationPosition && (
          <Marker position={stationPosition} icon={createStationIcon()}>
            <Popup>Your stop</Popup>
          </Marker>
        )}
        {Object.entries(stopMonitoringData).map(([routeName, arrivals]) =>
          arrivals.map((arrival, i) => (
            <Marker
              key={`${routeName}-${i}`}
              position={[arrival.vehicleLat, arrival.vehicleLon]}
              icon={createLabeledBusIcon(routeName)}
            >
              <Popup>{routeName} — {arrival.destination}</Popup>
            </Marker>
          ))
        )}
        {Object.entries(routePolylines).map(([routeId, poly]) => (
          <Polyline key={routeId} positions={poly} color="blue" weight={2} opacity={0.6} />
        ))}
        <MapBoundsSetter positions={allPositions} />
      </MapContainer>
    </Box>
  );
};

export default DashboardMap;
