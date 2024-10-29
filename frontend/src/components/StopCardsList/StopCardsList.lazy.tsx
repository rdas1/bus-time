import React, { lazy, Suspense } from 'react';

const LazyStopCardsList = lazy(() => import('./StopCardsList'));

const StopCardsList = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyStopCardsList {...props} />
  </Suspense>
);

export default StopCardsList;
