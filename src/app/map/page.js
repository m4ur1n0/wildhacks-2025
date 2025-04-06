"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

export default function MapPage() {
  const router = useRouter();
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 14,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [pins, setPins] = useState([]);
  const [animationFinished, setAnimationFinished] = useState(false);

  // Set animationFinished to true after bounce animation (0.8s) completes
  useEffect(() => {
    const timeout = setTimeout(() => setAnimationFinished(true), 800);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setViewport((prev) => ({ ...prev, latitude, longitude }));

          const demoPins = [
            {
              id: 1,
              latitude: latitude + 0.01,
              longitude: longitude + 0.01,
              title: 'Local Market',
              description: 'A great local market to explore fresh produce.',
            },
            {
              id: 2,
              latitude: latitude - 0.01,
              longitude: longitude - 0.01,
              title: 'Organic Farm',
              description: 'This organic farm offers fresh vegetables and seasonal fruits.',
            },
          ];
          setPins(demoPins);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', fontFamily: '"Geist Sans", sans-serif' }}>
      <Map
        {...viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {/* User Location Marker – unclickable */}
        {userLocation && (
          <Marker latitude={userLocation.latitude} longitude={userLocation.longitude}>
            <div className={`marker-button ${animationFinished ? "enabled" : "disabled"} user-marker`} aria-label="Your Location">
              <img
                src="/_images/pin_red.png"
                alt="User pin"
                className="pin bounce"
              />
              <span className="tooltip">Your Location</span>
            </div>
          </Marker>
        )}

        {/* Other Location Markers – redirect on click */}
        {pins.map((pin) => (
          <Marker key={pin.id} latitude={pin.latitude} longitude={pin.longitude}>
            <button
              className={`marker-button ${animationFinished ? "enabled" : "disabled"}`}
              onClick={(e) => {
                e.preventDefault();
                router.push(`/location/${pin.id}`);
              }}
              aria-label={pin.title}
            >
              <img
                src="/_images/pin_blue.png"
                alt="Location pin"
                className="pin bounce"
              />
              <span className="tooltip">{pin.title}</span>
            </button>
          </Marker>
        ))}
      </Map>

      <style jsx>{`
        .pin {
          width: 35px;
          height: 35px;
          opacity: 0; /* Initially hidden until animation plays */
        }
        .bounce {
          animation: bounce 0.8s ease forwards;
          animation-delay: 1s;
        }
        @keyframes bounce {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          25% {
            transform: translateY(0);
            opacity: 1;
          }
          27% {
            transform: translateY(0); /* Abrupt impact */
          }
          35% {
            transform: translateY(-10px); /* Slight upward bounce */
          }
          45% {
            transform: translateY(0); /* Settle quickly */
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .marker-button {
          position: relative;
          display: inline-block;
          background: none;
          border: none;
        }
        /* User marker styling: unclickable (default cursor) */
        .user-marker {
          cursor: default;
          pointer-events: none; /* Disables any click events */
        }
        /* Other markers will have pointer cursor */
        .enabled:not(.user-marker) {
          cursor: pointer;
        }
        /* Disable tooltip interaction until animation finishes */
        .marker-button.disabled .tooltip {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        .marker-button.enabled .tooltip {
          transition: opacity 0.2s ease; /* No additional delay */
        }
        .marker-button.enabled:hover .tooltip {
          opacity: 1;
          visibility: visible;
        }
        .tooltip {
          position: absolute;
          bottom: 120%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          z-index: 100;
          font-family: "Geist Sans", sans-serif;
        }
      `}</style>
    </div>
  );
}
