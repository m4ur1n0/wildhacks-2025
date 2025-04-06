import { Marker } from "react-map-gl/maplibre";

export default function UserLocationMarker({ userLocation, animationFinished }) {
  return (
    <Marker latitude={userLocation.latitude} longitude={userLocation.longitude}>
      <div className="marker-button user-marker" aria-label="Your Location">
        <img src="/images/needle_red.png" alt="User pin" className="pin bounce" />
        {animationFinished && (
          <div className="tooltip small-tooltip">Your Location</div>
        )}
      </div>
      <style jsx>{`
        .pin {
          width: 35px;
          height: 35px;
          opacity: 0;
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
            transform: translateY(0);
          }
          35% {
            transform: translateY(-10px);
          }
          45% {
            transform: translateY(0);
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
        .user-marker {
          cursor: default;
        }
        .tooltip.small-tooltip {
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
          transition: opacity 0.2s ease;
          z-index: 100;
        }
        .marker-button:hover .tooltip.small-tooltip {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
    </Marker>
  );
}