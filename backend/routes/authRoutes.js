import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/live', async (req, res) => {
  try {
    const apiKey = process.env.CRICKET_API_KEY;

    const response = await axios.get('https://api.cricapi.com/v1/currentMatches', {
      params: {
        apikey: apiKey,
        offset: 0,
      },
      timeout: 10000,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching live matches',
      error: error.response?.data || error.message,
    });
  }
});

export default router;