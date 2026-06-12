import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  teamA: { type: String, required: true, trim: true },
  teamB: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true, trim: true },
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  result: { type: String, trim: true },
  scoreA: { type: String, trim: true },
  scoreB: { type: String, trim: true },
  tournament: { type: String, trim: true },
  format: { type: String, enum: ['Test', 'ODI', 'T20'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

matchSchema.index({ teamA: 'text', teamB: 'text', venue: 'text' });

export default mongoose.model('Match', matchSchema);
