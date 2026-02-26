import React, { FC, useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L, { LatLngTuple } from 'leaflet';
import { DirectionsBusFilledRounded as BusIcon } from '@mui/icons-material';
import ReactDOMServer from 'react-dom/server';
import { Arrival, getPolylinesAlongRoute, getNearbyStops, NearbyStop } from '../BusStopDashboard/BusStopDashboard';
import { createStationIcon } from '../MapWidget/MapWidget';
import { getRouteColor } from '../../utils/routeColors';

const tileLayerUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAPS_API_KEY}`;
const tileLayerAttribution = `'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'`;

export const createLabeledBusIcon = (routeShortName: string, bearing?: number): L.DivIcon => {
  const color = getRouteColor(routeShortName);
  const busIconHtml = ReactDOMServer.renderToString(
    <BusIcon style={{ color, fontSize: '24px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
  );
  const arrowHtml = bearing != null ? `
    <svg width="12" height="12" viewBox="-6 -6 12 12" overflow="visible"
         style="position:absolute;top:-16px;left:50%;
                transform:translateX(-50%) rotate(${bearing}deg);
                filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));">
      <polygon points="0,-5 4,3 0,1 -4,3" fill="${color}" stroke="white" stroke-width="0.8" />
    </svg>` : '';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;display:inline-flex;flex-direction:column;align-items:center;gap:1px;">
        ${arrowHtml}
        <div style="background:${color};color:white;font-size:10px;font-weight:bold;
                    font-family:Helvetica,Arial,sans-serif;padding:1px 4px;
                    border-radius:3px;white-space:nowrap;
                    box-shadow:0 1px 3px rgba(0,0,0,0.5);">${routeShortName}</div>
        ${busIconHtml}
      </div>`,
    iconSize: [40, 36],
    iconAnchor: [20, 36],
  });
};

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

const MapCenterTracker: FC<{ onCenterChange: (lat: number, lon: number) => void }> = ({ onCenterChange }) => {
  useMapEvents({
    moveend: (e) => {
      const { lat, lng } = e.target.getCenter();
      onCenterChange(lat, lng);
    },
  });
  return null;
};

interface DashboardMapProps {
  stopMonitoringData: Record<string, Arrival[]>;
  stationPosition?: [number, number];
  currentStopCode?: string;
}

const ANIM_DURATION = 1500; // ms

const DashboardMap: FC<DashboardMapProps> = ({ stopMonitoringData, stationPosition, currentStopCode }) => {
  const navigate = useNavigate();
  const [routePolylines, setRoutePolylines] = useState<Record<string, LatLngTuple[][]>>({});
  const [nearbyStops, setNearbyStops] = useState<NearbyStop[]>([]);

  useEffect(() => {
    if (!stationPosition) return;
    getNearbyStops(stationPosition[0], stationPosition[1]).then(setNearbyStops);
  }, [stationPosition]);

  const [displayPositions, setDisplayPositions] = useState<Record<string, LatLngTuple>>({});
  const displayPositionsRef = useRef<Record<string, LatLngTuple>>({});
  const animFromRef = useRef<Record<string, LatLngTuple>>({});
  const animStartRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const panDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const missingRoutes = Object.keys(stopMonitoringData).filter(r => !routePolylines[r]);
    if (missingRoutes.length === 0) return;
    Promise.all(missingRoutes.map(async id => ({ id, poly: await getPolylinesAlongRoute(id) })))
      .then(results => setRoutePolylines(prev => {
        const next = { ...prev };
        results.forEach(({ id, poly }) => { if (poly) next[id] = poly as LatLngTuple[][]; });
        return next;
      }));
  }, [stopMonitoringData]); // intentionally excludes routePolylines to avoid infinite loop

  useEffect(() => {
    const targets: Record<string, LatLngTuple> = {};
    Object.entries(stopMonitoringData).forEach(([routeName, arrivals]) => {
      arrivals.forEach((arrival, i) => {
        targets[`${routeName}-${i}`] = [arrival.vehicleLat, arrival.vehicleLon];
      });
    });

    animFromRef.current = { ...displayPositionsRef.current };
    Object.entries(targets).forEach(([key, pos]) => {
      if (!animFromRef.current[key]) animFromRef.current[key] = pos;
    });

    if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    animStartRef.current = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - animStartRef.current) / ANIM_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out

      const interpolated: Record<string, LatLngTuple> = {};
      Object.entries(targets).forEach(([key, target]) => {
        const from = animFromRef.current[key] ?? target;
        interpolated[key] = [
          from[0] + (target[0] - from[0]) * eased,
          from[1] + (target[1] - from[1]) * eased,
        ];
      });

      displayPositionsRef.current = interpolated;
      setDisplayPositions({ ...interpolated });

      if (t < 1) animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current); };
  }, [stopMonitoringData]);

  const allPositions: LatLngTuple[] = [
    ...(stationPosition ? [stationPosition as LatLngTuple] : []),
    ...Object.values(stopMonitoringData).flat().map(
      a => [a.vehicleLat, a.vehicleLon] as LatLngTuple
    ),
  ];

  return (
    <Box h="100%" w="100%" position="relative">
      {/* Crosshair at map center */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        pointerEvents="none"
        zIndex={1000}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px white)' }}>
          <line x1="12" y1="2"  x2="12" y2="9"  stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="15" x2="12" y2="22" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2"  y1="12" x2="9"  y2="12" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="12" x2="22" y2="12" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="#222" />
        </svg>
      </Box>
      <MapContainer
        center={stationPosition ?? [40.7580, -73.9855]}
        zoom={14}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
        {nearbyStops
          .filter(stop => stop.code !== currentStopCode)
          .map(stop => (
            <CircleMarker
              key={stop.id}
              center={[stop.lat, stop.lon]}
              radius={7}
              pathOptions={{ color: '#444', fillColor: 'white', fillOpacity: 1, weight: 2 }}
              eventHandlers={{ click: () => navigate(`/${stop.code}`) }}
            >
              <Tooltip direction="top" offset={[0, -8]}>{stop.name}</Tooltip>
            </CircleMarker>
          ))
        }
        {stationPosition && (
          <Marker position={stationPosition} icon={createStationIcon()}>
            <Popup>Your stop</Popup>
          </Marker>
        )}
        {Object.entries(stopMonitoringData).map(([routeName, arrivals]) =>
          arrivals.map((arrival, i) => {
            const key = `${routeName}-${i}`;
            const pos = displayPositions[key] ?? [arrival.vehicleLat, arrival.vehicleLon];
            return (
              <Marker key={key} position={pos} icon={createLabeledBusIcon(routeName, arrival.vehicleBearing)}>
                <Popup>{routeName} — {arrival.destination}</Popup>
              </Marker>
            );
          })
        )}
        {Object.entries(routePolylines).flatMap(([routeId, segments]) =>
          segments.map((seg, i) => (
            <Polyline key={`${routeId}-${i}`} positions={seg} color={getRouteColor(routeId)} weight={2} opacity={0.6} />
          ))
        )}
        <MapBoundsSetter positions={allPositions} />
        <MapCenterTracker onCenterChange={(lat, lon) => {
          if (panDebounceRef.current !== null) clearTimeout(panDebounceRef.current);
          panDebounceRef.current = setTimeout(async () => {
            panDebounceRef.current = null;
            const stops = await getNearbyStops(lat, lon);
            setNearbyStops(stops);
            if (stops.length === 0) return;
            const nearest = stops.reduce((best, s) =>
              Math.hypot(s.lat - lat, s.lon - lon) < Math.hypot(best.lat - lat, best.lon - lon) ? s : best
            );
            if (nearest.code !== currentStopCode) navigate(`/${nearest.code}`);
          }, 300);
        }} />
      </MapContainer>
    </Box>
  );
};

export default DashboardMap;
