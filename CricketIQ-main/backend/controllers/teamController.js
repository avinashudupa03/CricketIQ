import { validationResult } from 'express-validator';
import Team from '../models/Team.js';
import Player from '../models/Player.js';

export async function getTeams(req, res) {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user.id };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Team.countDocuments(filter);
    const teams = await Team.find(filter)
      .populate('players', 'name role avatar status')
      .sort({ points: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ teams, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teams.', error: err.message });
  }
}

export async function getTeam(req, res) {
  try {
    const team = await Team.findOne({ _id: req.params.id, userId: req.user.id }).populate('players');
    if (!team) return res.status(404).json({ message: 'Team not found.' });
    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching team.', error: err.message });
  }
}

export async function createTeam(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const team = await Team.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ team });
  } catch (err) {
    res.status(500).json({ message: 'Error creating team.', error: err.message });
  }
}

export async function updateTeam(req, res) {
  try {
    const team = await Team.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!team) return res.status(404).json({ message: 'Team not found.' });
    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: 'Error updating team.', error: err.message });
  }
}

export async function addPlayerToTeam(req, res) {
  try {
    const { playerId } = req.body;
    const team = await Team.findOne({ _id: req.params.id, userId: req.user.id });
    if (!team) return res.status(404).json({ message: 'Team not found.' });

    const player = await Player.findOne({ _id: playerId, userId: req.user.id });
    if (!player) return res.status(404).json({ message: 'Player not found.' });

    if (team.players.includes(playerId)) return res.status(400).json({ message: 'Player already in team.' });

    team.players.push(playerId);
    await team.save();
    res.json({ team: await team.populate('players') });
  } catch (err) {
    res.status(500).json({ message: 'Error adding player to team.', error: err.message });
  }
}

export async function removePlayerFromTeam(req, res) {
  try {
    const { playerId } = req.body;
    const team = await Team.findOne({ _id: req.params.id, userId: req.user.id });
    if (!team) return res.status(404).json({ message: 'Team not found.' });

    team.players = team.players.filter((p) => p.toString() !== playerId);
    await team.save();
    res.json({ team: await team.populate('players') });
  } catch (err) {
    res.status(500).json({ message: 'Error removing player from team.', error: err.message });
  }
}

export async function deleteTeam(req, res) {
  try {
    const team = await Team.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!team) return res.status(404).json({ message: 'Team not found.' });
    res.json({ message: 'Team deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting team.', error: err.message });
  }
}
