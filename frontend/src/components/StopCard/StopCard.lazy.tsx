import React, { lazy, Suspense } from 'react';

const LazyStopCard = lazy(() => import('./StopCard'));

const StopCard = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyStopCard {...props} />
  </Suspense>
);

export default StopCard;
