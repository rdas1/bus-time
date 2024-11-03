import React, { lazy, Suspense } from 'react';

const LazyServiceAlertCard = lazy(() => import('./ServiceAlertCard'));

const ServiceAlertCard = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyServiceAlertCard {...props} />
  </Suspense>
);

export default ServiceAlertCard;
