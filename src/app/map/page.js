"use client";

import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapPage() {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 12
  });
  const [userLocation, setUserLocation] = useState(null);
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);

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
              description: 'A great local market to explore fresh produce.'
            },
            {
              id: 2,
              latitude: latitude - 0.01,
              longitude: longitude - 0.01,
              title: 'Organic Farm',
              description: 'This organic farm offers fresh vegetables and seasonal fruits.'
            }
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
    <div style={{ height: '100vh', width: '100%' }}>
      <Map
        {...viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {userLocation && (
          <Marker latitude={userLocation.latitude} longitude={userLocation.longitude}>
            <div style={{ fontSize: '24px' }} title="You are here">
              📍
            </div>
          </Marker>
        )}

        {pins.map((pin) => (
          <Marker key={pin.id} latitude={pin.latitude} longitude={pin.longitude}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedPin(pin);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              title={pin.title}
            >
              <img src="/pin.svg" alt="pin" style={{ width: '25px', height: '25px' }} onError={(e) => {
                e.target.style.display = 'none';
              }} />
              <span style={{ display: 'none' }}>📌</span>
            </button>
          </Marker>
        ))}

        {selectedPin && (
          <Popup
            latitude={selectedPin.latitude}
            longitude={selectedPin.longitude}
            onClose={() => setSelectedPin(null)}
            closeOnClick={false}
            anchor="top"
          >
            <div>
              <h3>{selectedPin.title}</h3>
              <p>{selectedPin.description}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
