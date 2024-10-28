import React, { lazy, Suspense } from 'react';

const LazyStopLabel = lazy(() => import('./StopLabel'));

const StopLabel = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyStopLabel {...props} />
  </Suspense>
);

export default StopLabel;
