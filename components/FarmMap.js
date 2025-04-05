import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { onSnapshot, collection, db } from './firebase'; // assuming you have a firebase.js file

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function FarmMap() {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283],
      zoom: 3
    });

    // Add farm locations
    const unsubscribe = onSnapshot(collection(db, 'farms'), (snapshot) => {
      snapshot.docChanges().forEach(change => {
        const { coordinates, name } = change.doc.data();
        new mapboxgl.Marker()
          .setLngLat(coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${name}</h3>`))
          .addTo(map);
      });
    });

    return () => {
      unsubscribe();
      map.remove();
    };
  }, []);

  return <div ref={mapContainer} className="map-container" />;
}
