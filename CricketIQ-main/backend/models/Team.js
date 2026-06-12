import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  shortName: { type: String, required: true, uppercase: true, trim: true },
  country: { type: String, required: true, trim: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  netRunRate: { type: Number, default: 0 },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

teamSchema.index({ name: 'text', shortName: 'text' });

export default mongoose.model('Team', teamSchema);
