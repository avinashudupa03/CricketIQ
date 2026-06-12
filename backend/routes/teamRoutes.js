import { Router } from 'express';
import { body } from 'express-validator';
import {
  getTeams, getTeam, createTeam, updateTeam, addPlayerToTeam, removePlayerFromTeam, deleteTeam,
} from '../controllers/teamController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getTeams);
router.get('/:id', getTeam);
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('shortName').trim().notEmpty().withMessage('Short name is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
], createTeam);
router.put('/:id', updateTeam);
router.post('/:id/players', [body('playerId').notEmpty().withMessage('Player ID is required')], addPlayerToTeam);
router.delete('/:id/players', [body('playerId').notEmpty().withMessage('Player ID is required')], removePlayerFromTeam);
router.delete('/:id', deleteTeam);

export default router;
