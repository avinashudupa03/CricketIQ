import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer, getPlayerStats,
} from '../controllers/playerController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getPlayers);
router.get('/stats', getPlayerStats);
router.get('/:id', getPlayer);
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').isIn(['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper']).withMessage('Invalid role'),
  body('team').trim().notEmpty().withMessage('Team is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
], createPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

export default router;
