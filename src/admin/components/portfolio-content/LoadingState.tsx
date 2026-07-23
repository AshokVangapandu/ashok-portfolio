/* src/admin/components/portfolio-content/LoadingState.tsx */
import React from 'react';

// Relative path to testimonials is up 2 levels since we are in components/portfolio-content
// Let's resolve:
// src/admin/components/portfolio-content/LoadingState.tsx
// src/admin/pages/testimonials/components/LoadingSkeleton.tsx
// Up 2 levels from components/portfolio-content is src/admin/
// Then pages/testimonials/components/LoadingSkeleton

import { LoadingSkeleton as Skeleton } from '../../pages/testimonials/components/LoadingSkeleton';

export const LoadingState: React.FC = () => {
  return <Skeleton />;
};

export default LoadingState;
