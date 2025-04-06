"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function LocationProfile() {
  const { id } = useParams();

  // Dummy data for the two location pins.
  const profiles = {
    '1': {
      title: 'Local Market',
      description:
        'A great local market to explore fresh produce. Enjoy a wide variety of seasonal fruits, vegetables, and artisan goods.',
    },
    '2': {
      title: 'Organic Farm',
      description:
        'This organic farm offers fresh vegetables and seasonal fruits. Visit for farm tours, CSA programs, and locally grown produce.',
    },
  };

  const profile = profiles[id] || {
    title: 'Unknown Location',
    description: 'No details available for this location.',
  };

  return (
    <div
      style={{
        margin: '0 auto',
        maxWidth: '600px',
        padding: '2rem',
        fontFamily: '"Geist Sans", sans-serif'
      }}
    >
      <h1>{profile.title}</h1>
      <p>{profile.description}</p>
      <p style={{ fontFamily: '"Geist Mono", monospace', fontSize: '14px' }}>
        {/* Sample monospaced text */}
        Sample code snippet or note.
      </p>
      <Link href="/map" style={{ color: 'blue', textDecoration: 'underline' }}>
        Back to Map
      </Link>
      <style jsx>{`
        h1, p {
          margin: 0 0 1rem 0;
        }
      `}</style>
    </div>
  );
}
