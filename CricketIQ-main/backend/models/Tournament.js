import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  format: { type: String, required: true, trim: true },
  teamCount: { type: Number, default: 0 },
  matchCount: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  winner: { type: String, trim: true },
  venue: { type: String, trim: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  fixtures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
  pointsTable: [{
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    drawn: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    nrr: { type: Number, default: 0 },
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

tournamentSchema.index({ name: 'text', venue: 'text' });

export default mongoose.model('Tournament', tournamentSchema);
