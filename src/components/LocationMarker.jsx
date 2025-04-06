import { Marker } from "react-map-gl/maplibre";

export default function LocationMarker({
  pin,
  expandedLocation,
  animationFinished,
  onMarkerClick,
  renderSmallTooltipText,
  renderExpandedTooltip
}) {
  return (
    <Marker latitude={pin.latitude} longitude={pin.longitude}>
      <div
        className="marker-button clickable"
        onClick={(e) => {
          e.preventDefault();
          onMarkerClick(pin);
        }}
        role="button"
        tabIndex={0}
        aria-label={pin.type === "farm" ? pin.name : `[${pin.street}] drop off location`}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onMarkerClick(pin);
          }
        }}
      >
        <img src="/images/pin_blue.png" alt="Location pin" className="pin bounce" />
        {animationFinished && !expandedLocation && (
          <div className="tooltip small-tooltip">
            {renderSmallTooltipText(pin)}
          </div>
        )}
        {animationFinished && expandedLocation && expandedLocation.id === pin.id && (
          <div className="tooltip expanded-tooltip-container">
            {renderExpandedTooltip(pin)}
          </div>
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
        .marker-button {
          position: relative;
          display: inline-block;
          background: none;
          border: none;
        }
        .clickable {
          cursor: pointer;
        }
        /* Small tooltip styling */
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
        /* Expanded tooltip container styling */
        .tooltip.expanded-tooltip-container {
          position: absolute;
          bottom: 120%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.85);
          color: #fff;
          padding: 1rem;
          border-radius: 8px;
          font-size: 14px;
          width: 220px;
          z-index: 200;
          animation: expandTooltip 0.3s ease forwards;
          cursor: default;
        }
        @keyframes expandTooltip {
          0% {
            transform: translateX(-50%) scaleY(0);
            opacity: 0;
          }
          100% {
            transform: translateX(-50%) scaleY(1);
            opacity: 1;
          }
        }
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
          font-size: 1rem;
          color: #fff;
          transition: transform 0.1s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .close-button:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        .close-button:active {
          transform: scale(0.95);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .exp-description {
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .detail-button {
          background: #fff;
          color: #000;
          border: none;
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          border-radius: 4px;
          transition: transform 0.1s ease, background 0.2s ease, box-shadow 0.2s ease;
          align-self: flex-start;
          cursor: pointer;
        }
        .detail-button:hover {
          transform: scale(1.05);
          background: #ddd;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        .detail-button:active {
          transform: scale(0.95);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </Marker>
  );
}