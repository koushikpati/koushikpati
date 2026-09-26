// FILE PATH: src/app/loading.tsx

import React from 'react';

export default function Loading() {
  return (
    <main className="page loading">
      <div className="skeleton skeleton-hero" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line" />
    </main>
  );
}
