import { Router } from 'express';
import { body } from 'express-validator';
import {
  getTournaments, getTournament, createTournament, updateTournament,
  deleteTournament, getStandings, getFixtures, updatePointsTable,
} from '../controllers/tournamentController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getTournaments);
router.get('/:id', getTournament);
router.get('/:id/standings', getStandings);
router.get('/:id/fixtures', getFixtures);
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('format').trim().notEmpty().withMessage('Format is required'),
], createTournament);
router.put('/:id', updateTournament);
router.put('/:id/points', updatePointsTable);
router.delete('/:id', deleteTournament);

export default router;
