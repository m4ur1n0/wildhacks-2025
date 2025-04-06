"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapState } from '../hooks/useMapState';
import { useGeolocation } from "../hooks/useGeolocation";
import LocationMarker from './LocationMarker';
import UserLocationMarker from "./UserLocationMarker";

import { getAllFarms } from "@/lib/db";

// console.log("markersData", markersData);


const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

const MapComponent = () => {
  const router = useRouter();
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  // Custom hooks for state management
  const { viewport, setViewport } = useMapState();
  const { userLocation, pins } = useGeolocation(setViewport);

  // Markers' bounce animation completes after 0.8s
  useEffect(() => {
    const timeout = setTimeout(() => setAnimationFinished(true), 800);
    return () => clearTimeout(timeout);
  }, []);

  // Allow closing expanded tooltip via Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setExpandedLocation(null);
    }
  }, []);

  useEffect(() => {
    if (expandedLocation) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [expandedLocation, handleKeyDown]);

  // Handler for marker clicks
  const handleMarkerClick = useCallback((pin) => {
    // Check if this pin is already expanded AND has a link
    if (pin === expandedLocation && pin.link) { // Use pin.link directly
      router.push(pin.link);
    }
    setExpandedLocation(pin);
  }, [expandedLocation, router]);

  // Memoized renderer for small tooltip content
  const renderSmallTooltipText = useCallback((marker) => {
    if (marker.type === "farm") {
      return (
        <>
          <div className="tooltip-title">{marker.name}</div>
          <div className="tooltip-address">{marker.address}</div>
        </>
      );
    } else if (marker.type === "dropoff") {
      return (
        <>
          <div className="tooltip-title">
            [{marker.street}] drop off location
          </div>
          <div className="tooltip-address">{marker.address}</div>
        </>
      );
    }
    return null;
  }, []);

  // Memoized renderer for expanded tooltip content

  const renderExpandedTooltip = useCallback((marker) => {
    return (
      <div className="expanded-tooltip">
        <div className="exp-header">
          {marker.type === "farm" ? (
            <>
              <div className="exp-title">{marker.name}</div>
              <div className="exp-address">{marker.address}</div>
            </>
          ) : (
            <>
              <div className="exp-title">[{marker.street}] drop off location</div>
              <div className="exp-address">{marker.address}</div>
            </>
          )}
          <button
            className="close-button"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedLocation(null);
            }}
            aria-label="Close tooltip"
          >
            ×
          </button>
        </div>
        <div className="separator" />
        <div className="exp-description">{marker.description}</div>
        {marker.type === "farm" ? (
            <>
        <button
          className="detail-button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`../farm/${marker.id}`);
          }}
        >
          View Details
        </button>
        </>
        ) : (<></>)}

        <style jsx>{`
        .expanded-tooltip {
          display: flex;
          flex-direction: column;
        }
        .exp-header {
          position: relative;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #ccc;
          margin-bottom: 0.5rem;
        }
        .exp-title {
          font-weight: bold;
          margin-bottom: 0.25rem;
        }
        .exp-address {
          font-size: 0.9rem;
        }
        .close-button {
          position: absolute;
          top: 0;
          right: 0;
          background: transparent;
          border: none;
          font-size: 1.25rem;
          color: #fff;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
          transform: translateZ(0);
        }
        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateZ(0) scale(1.1);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
        }
        .close-button:active {
          transform: translateZ(0) scale(0.95);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        }
        .exp-description {
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }
        .detail-button {
          background: #fff;
          color: #000;
          border: none;
          padding: 0.5rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 4px;
          transition: all 0.2s ease;
          align-self: flex-start;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transform: translateZ(0);
        }
        .detail-button:hover {
          background: #f0f0f0;
          transform: translateZ(0) scale(1.05) translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .detail-button:active {
          transform: translateZ(0) scale(0.98) translateY(0);
          background: #e0e0e0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
      `}</style>
      </div>
    );
  }, [router, setExpandedLocation]);

  // Memoize pin markers to prevent unnecessary re-renders
  const markerElements = useMemo(() => {
    return pins.map((pin) => (
      <LocationMarker
        key={pin.id}
        pin={pin}
        expandedLocation={expandedLocation}
        animationFinished={animationFinished}
        onMarkerClick={handleMarkerClick}
        renderSmallTooltipText={renderSmallTooltipText}
        renderExpandedTooltip={renderExpandedTooltip}

      />
    ));
  }, [pins, expandedLocation, animationFinished, handleMarkerClick, renderSmallTooltipText, renderExpandedTooltip]);

  const [allCoordinates, setAllCoordinates] = useState([
    {
        id: "dropoff1",
        type: "dropoff",
        street: "Main St",
        address: "101 Dropoff Way",
        description: "Convenient dropoff location in the heart of town.",
        // Example coordinates for a dropoff in the North Shore area
        coordinates: [-87.68, 42.05],
        icon: "/images/pin_blue.png",
      },
      {
        id: "dropoff2",
        type: "dropoff",
        street: "Elm St",
        address: "202 Dropoff Ave",
        description: "Spacious area with ample parking.",
        // Adjusted coordinates for a dropoff in the North Shore area
        coordinates: [-87.70, 42.10],
        icon: "/images/pin_blue.png",
      },
      {
        id: "dropoff3",
        type: "dropoff",
        street: "Pine St",
        address: "303 Dropoff Blvd",
        description: "Safe and secure dropoff point.",
        // Adjusted coordinates for a dropoff in the North Shore area
        coordinates: [-87.75, 42.07],
        icon: "/images/pin_blue.png",
      },
  ]);

  async function getAndSetAllFarms() {
    const allFarms = await getAllFarms();
    let coords = [];
    allFarms.foreach((farm) => {
        if (farm.location) {
            const farmLocation = {
                id: farm.name,
                type: "farm",
                name : farm.name,
                coordinates : [farm.location.latitude, farm.location.longitude],
                icon : "/images/pin_red.png",
                link : `/farm/#${farm.id}`,
            }
            coords.push(farmLocation);

        }
    });
    setAllCoordinates(prev => ([...prev, ...coords]));

  }

  useEffect(() => {
    getAndSetAllFarms();
  }, [])

  return (
    <div className="map-container">
      <Map
        {...viewport}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {userLocation && (
          <UserLocationMarker
            userLocation={userLocation}
            animationFinished={animationFinished}
          />
        )}

        {allCoordinates.map((marker) => (
          <LocationMarker
            key={marker.id}
            pin={marker}
            expandedLocation={expandedLocation}
            animationFinished={animationFinished}
            onMarkerClick={handleMarkerClick}
            renderSmallTooltipText={renderSmallTooltipText}
            renderExpandedTooltip={renderExpandedTooltip}
          />
        ))}
      </Map>
      <style jsx>{`
        .map-container {
          height: 100vh;
          width: 100%;
          font-family: "Geist Sans", sans-serif;
        }
      `}</style>
    </div>
  );
}

export default MapComponent;