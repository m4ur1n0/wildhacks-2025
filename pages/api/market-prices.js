export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.usda.gov/data/...${req.query}&api_key=${process.env.USDA_API_KEY}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
}
