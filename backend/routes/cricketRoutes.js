import express from 'express';

const router = express.Router();

router.get('/live', async (req, res) => {
  try {
    const apiKey = process.env.CRICKET_API_KEY;

    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching live matches',
      error: error.message,
    });
  }
});

export default router;