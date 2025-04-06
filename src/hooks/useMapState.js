// src/app/map/hooks/useMapState.js
import { useState } from "react";

// Make sure we're exporting the function properly
export function useMapState() {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 14,
  });

  return { viewport, setViewport };
}

// You can also use the default export if you prefer
// export default useMapState;