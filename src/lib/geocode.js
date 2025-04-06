const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;

export async function geocodeWithLocationIQ(address) {
  const encoded = encodeURIComponent(address);
  const url = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encoded}&format=json`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data || data.length === 0) throw new Error('No results found');

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}
