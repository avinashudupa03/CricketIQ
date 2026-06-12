import { validationResult } from 'express-validator';
import Match from '../models/Match.js';

export async function getMatches(req, res) {
  try {
    const { search, status, format, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user.id };

    if (search) {
      filter.$or = [
        { teamA: { $regex: search, $options: 'i' } },
        { teamB: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { tournament: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;
    if (format) filter.format = format;

    const total = await Match.countDocuments(filter);
    const matches = await Match.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ matches, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching matches.', error: err.message });
  }
}

export async function getMatch(req, res) {
  try {
    const match = await Match.findOne({ _id: req.params.id, userId: req.user.id });
    if (!match) return res.status(404).json({ message: 'Match not found.' });
    res.json({ match });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching match.', error: err.message });
  }
}

export async function createMatch(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const match = await Match.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ match });
  } catch (err) {
    res.status(500).json({ message: 'Error creating match.', error: err.message });
  }
}

export async function updateMatch(req, res) {
  try {
    const match = await Match.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!match) return res.status(404).json({ message: 'Match not found.' });
    res.json({ match });
  } catch (err) {
    res.status(500).json({ message: 'Error updating match.', error: err.message });
  }
}

export async function updateMatchScore(req, res) {
  try {
    const { scoreA, scoreB, result, status } = req.body;
    const match = await Match.findOne({ _id: req.params.id, userId: req.user.id });
    if (!match) return res.status(404).json({ message: 'Match not found.' });

    if (scoreA !== undefined) match.scoreA = scoreA;
    if (scoreB !== undefined) match.scoreB = scoreB;
    if (result !== undefined) match.result = result;
    if (status !== undefined) match.status = status;

    await match.save();
    res.json({ match });
  } catch (err) {
    res.status(500).json({ message: 'Error updating match score.', error: err.message });
  }
}

export async function deleteMatch(req, res) {
  try {
    const match = await Match.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!match) return res.status(404).json({ message: 'Match not found.' });
    res.json({ message: 'Match deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting match.', error: err.message });
  }
}

export async function getMatchHistory(req, res) {
  try {
    const { team } = req.query;
    const filter = { userId: req.user.id, status: 'completed' };

    if (team) {
      filter.$or = [{ teamA: { $regex: team, $options: 'i' } }, { teamB: { $regex: team, $options: 'i' } }];
    }

    const matches = await Match.find(filter).sort({ date: -1 }).limit(50);
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching match history.', error: err.message });
  }
}
