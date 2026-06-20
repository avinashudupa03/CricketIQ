import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/live', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.cricketdata.org/v1/currentMatches?apikey=${process.env.CRICKET_API_KEY}&offset=0`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching live matches',
      error: error.message,
    });
  }
});

export default router;