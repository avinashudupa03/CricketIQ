import { validationResult } from 'express-validator';
import Tournament from '../models/Tournament.js';

export async function getTournaments(req, res) {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user.id };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;

    const total = await Tournament.countDocuments(filter);
    const tournaments = await Tournament.find(filter)
      .populate('teams', 'name shortName')
      .populate('fixtures', 'teamA teamB date status result scoreA scoreB format')
      .sort({ startDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ tournaments, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tournaments.', error: err.message });
  }
}

export async function getTournament(req, res) {
  try {
    const tournament = await Tournament.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('teams')
      .populate('fixtures');
    if (!tournament) return res.status(404).json({ message: 'Tournament not found.' });
    res.json({ tournament });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tournament.', error: err.message });
  }
}

export async function createTournament(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const tournament = await Tournament.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ tournament });
  } catch (err) {
    res.status(500).json({ message: 'Error creating tournament.', error: err.message });
  }
}

export async function updateTournament(req, res) {
  try {
    const tournament = await Tournament.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!tournament) return res.status(404).json({ message: 'Tournament not found.' });
    res.json({ tournament });
  } catch (err) {
    res.status(500).json({ message: 'Error updating tournament.', error: err.message });
  }
}

export async function deleteTournament(req, res) {
  try {
    const tournament = await Tournament.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!tournament) return res.status(404).json({ message: 'Tournament not found.' });
    res.json({ message: 'Tournament deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting tournament.', error: err.message });
  }
}

export async function getStandings(req, res) {
  try {
    const tournament = await Tournament.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('pointsTable.team', 'name shortName');
    if (!tournament) return res.status(404).json({ message: 'Tournament not found.' });
    res.json({ standings: tournament.pointsTable });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching standings.', error: err.message });
  }
}

export async function getFixtures(req, res) {
  try {
    const tournament = await Tournament.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('fixtures');
    if (!tournament) return res.status(404).json({ message: 'Tournament not found.' });
    res.json({ fixtures: tournament.fixtures });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching fixtures.', error: err.message });
  }
}

export async function updatePointsTable(req, res) {
  try {
    const { pointsTable } = req.body;
    const tournament = await Tournament.findOne({ _id: req.params.id, userId: req.user.id });
    if (!tournament) return res.status(404).json({ message: 'Tournament not found.' });

    tournament.pointsTable = pointsTable;
    await tournament.save();
    res.json({ tournament });
  } catch (err) {
    res.status(500).json({ message: 'Error updating points table.', error: err.message });
  }
}
