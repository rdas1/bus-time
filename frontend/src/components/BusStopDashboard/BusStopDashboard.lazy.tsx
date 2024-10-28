import React, { lazy, Suspense } from 'react';

const LazyBusStopDashboard = lazy(() => import('./BusStopDashboard'));

const BusStopDashboard = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyBusStopDashboard {...props} />
  </Suspense>
);

export default BusStopDashboard;
