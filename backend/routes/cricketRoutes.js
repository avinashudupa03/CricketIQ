import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/live', async (req, res) => {
  try {
    const response = await axios.get('https://api.cricapi.com/v1/currentMatches', {
      params: {
        apikey: process.env.CRICKET_API_KEY,
        offset: 0,
      },
      timeout: 15000,
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