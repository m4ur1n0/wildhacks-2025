// components/BaseMarker.jsx
import { Marker } from "react-map-gl/maplibre";

export default function BaseMarker({
  latitude,
  longitude,
  iconUrl,
  tooltipContent,
  onClick,
  isUser = false,
}) {
  return (
    <Marker latitude={latitude} longitude={longitude}>
      <div
        className={`relative inline-block ${!isUser && "cursor-pointer"}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={isUser ? "Your location" : "Location marker"}
        onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      >
        <img
          src={iconUrl}
          alt="Marker"
          className="w-9 h-9 opacity-0 animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        {tooltipContent && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black/75 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible">
            {tooltipContent}
          </div>
        )}
      </div>
    </Marker>
  );
}