// hooks/useGeolocation.js
import { useState, useEffect } from "react";

export function useGeolocation(setViewport) {
  const [userLocation, setUserLocation] = useState(null);
  const [pins, setPins] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setViewport((prev) => ({ ...prev, latitude, longitude }));

          // Demo pins with two types: "farm" and "dropoff"
          const demoPins = [
            {
              id: 1,
              latitude: latitude + 0.01,
              longitude: longitude + 0.01,
              type: "farm",
              name: "Local Market",
              address: "123 Market Street",
              description: "This farm sells fresh produce and artisanal goods.",
            },
            {
              id: 2,
              latitude: latitude - 0.01,
              longitude: longitude - 0.01,
              type: "dropoff",
              street: "Main Street",
              address: "456 Main Street, City, State",
              description: "This drop off location accepts produce donations daily.",
            },
          ];
          setPins(demoPins);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setError(error.message);
          // Set default pins when geolocation fails
          const defaultPins = [
            {
              id: 1,
              latitude: 37.78,
              longitude: -122.45,
              type: "farm",
              name: "Default Market",
              address: "123 Default Street",
              description: "This farm sells fresh produce and artisanal goods.",
            },
            {
              id: 2,
              latitude: 37.75,
              longitude: -122.41,
              type: "dropoff",
              street: "Default Street",
              address: "456 Default Street, City, State",
              description: "This drop off location accepts produce donations daily.",
            },
          ];
          setPins(defaultPins);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [setViewport]);

  return { userLocation, pins, error };
}