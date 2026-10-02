// FILE PATH: src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page error-page">
      <h1>Something went wrong</h1>
      <p>Sorry about that — please try refreshing the page.</p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
