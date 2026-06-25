import express from 'express';

const router = express.Router();

router.get('/live', async (req, res) => {
  try {
    const apiKey = process.env.CRICKET_API_KEY;

    console.log('API Key Present:', !!apiKey);

    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`
    );

    const data = await response.json();

    console.log('Cricket API Response:', data);

    res.json(data);
  } catch (error) {
    console.error('Cricket API Error:', error);

    res.status(500).json({
      message: 'Error fetching live matches',
      error: error.message,
    });
  }
});

export default router;