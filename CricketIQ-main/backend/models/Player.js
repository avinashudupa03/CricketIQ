import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'], required: true },
  team: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  matches: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  average: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  economy: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'injured', 'retired'], default: 'active' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

playerSchema.index({ name: 'text', team: 'text', country: 'text' });

export default mongoose.model('Player', playerSchema);
