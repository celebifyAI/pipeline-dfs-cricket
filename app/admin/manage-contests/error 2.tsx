'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Caught error in app/admin/contests/error.tsx:", error)
  }, [error])

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#2d3748', borderRadius: '8px' }}>
      <h2 style={{ color: '#fc8181' }}>Something went wrong loading contests!</h2>
      <p style={{ marginTop: '10px' }}>We apologize for the inconvenience. Our team has been notified.</p>
      <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#a0aec0' }}>
        Error Message: {error.message}
        {error.digest && ` (Digest: ${error.digest})`}
      </p>
      <button
        style={{
          marginTop: '20px',
          padding: '10px 15px',
          backgroundColor: '#4299e1',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em'
        }}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
