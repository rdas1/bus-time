import React, { lazy, Suspense } from 'react';

const LazyAlertsSection = lazy(() => import('./AlertsSection'));

const AlertsSection = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAlertsSection {...props} />
  </Suspense>
);

export default AlertsSection;
