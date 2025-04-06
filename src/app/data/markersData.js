// markersData.js
export const markersData = [
  // Farm markers (just outside Chicagoland; using pin_red.png)
  {
    id: "farm1",
    type: "farm",
    name: "Sunny Farm",
    address: "123 Country Road",
    description: "Organic vegetables and fruits grown locally.",
    // Example coordinates for a farm outside Chicagoland
    coordinates: [-87.90, 41.70],
    icon: "/images/pin_red.png",
  },
  {
    id: "farm2",
    type: "farm",
    name: "Green Valley Farm",
    address: "456 Rural Lane",
    description: "Family-owned dairy and produce.",
    // Adjusted coordinates for a farm outside Chicagoland
    coordinates: [-87.85, 41.73],
    icon: "/images/pin_red.png",
  },
  {
    id: "farm3",
    type: "farm",
    name: "Blueberry Farm",
    address: "789 Harvest St",
    description: "Known for its delicious, fresh blueberries.",
    // Adjusted coordinates for a farm outside Chicagoland
    coordinates: [-87.95, 41.68],
    icon: "/images/pin_red.png",
  },
  // Dropoff markers (around the North Shore; using pin_blue.png)
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
];
