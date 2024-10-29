import React, { lazy, Suspense } from 'react';

const LazyLaterArrivalsSection = lazy(() => import('./LaterArrivalsSection'));

const LaterArrivalsSection = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyLaterArrivalsSection {...props} />
  </Suspense>
);

export default LaterArrivalsSection;
