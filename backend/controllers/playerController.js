import { validationResult } from 'express-validator';
import Player from '../models/Player.js';

export async function getPlayers(req, res) {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user.id };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { team: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;

    const total = await Player.countDocuments(filter);
    const players = await Player.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ players, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching players.', error: err.message });
  }
}

export async function getPlayer(req, res) {
  try {
    const player = await Player.findOne({ _id: req.params.id, userId: req.user.id });
    if (!player) return res.status(404).json({ message: 'Player not found.' });
    res.json({ player });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching player.', error: err.message });
  }
}

export async function createPlayer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const player = await Player.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ player });
  } catch (err) {
    res.status(500).json({ message: 'Error creating player.', error: err.message });
  }
}

export async function updatePlayer(req, res) {
  try {
    const player = await Player.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!player) return res.status(404).json({ message: 'Player not found.' });
    res.json({ player });
  } catch (err) {
    res.status(500).json({ message: 'Error updating player.', error: err.message });
  }
}

export async function deletePlayer(req, res) {
  try {
    const player = await Player.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!player) return res.status(404).json({ message: 'Player not found.' });
    res.json({ message: 'Player deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting player.', error: err.message });
  }
}

export async function getPlayerStats(req, res) {
  try {
    const stats = await Player.aggregate([
      { $match: { userId: req.user._id || req.user.id } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          totalRuns: { $sum: '$runs' },
          totalWickets: { $sum: '$wickets' },
          avgAverage: { $avg: '$average' },
        },
      },
    ]);
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching player stats.', error: err.message });
  }
}
