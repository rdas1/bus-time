import React, { lazy, Suspense } from 'react';

const LazyMapWidget = lazy(() => import('./MapWidget'));

const MapWidget = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMapWidget {...props} />
  </Suspense>
);

export default MapWidget;
