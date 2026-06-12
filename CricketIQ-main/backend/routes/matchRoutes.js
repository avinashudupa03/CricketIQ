import { Router } from 'express';
import { body } from 'express-validator';
import {
  getMatches, getMatch, createMatch, updateMatch, updateMatchScore, deleteMatch, getMatchHistory,
} from '../controllers/matchController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getMatches);
router.get('/history', getMatchHistory);
router.get('/:id', getMatch);
router.post('/', [
  body('teamA').trim().notEmpty().withMessage('Team A is required'),
  body('teamB').trim().notEmpty().withMessage('Team B is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('format').isIn(['Test', 'ODI', 'T20']).withMessage('Invalid format'),
], createMatch);
router.put('/:id', updateMatch);
router.put('/:id/score', updateMatchScore);
router.delete('/:id', deleteMatch);

export default router;
