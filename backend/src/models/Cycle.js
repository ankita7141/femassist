import mongoose from 'mongoose';

const cycleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    flow: {
      type: String,
      enum: ['light', 'medium', 'heavy'],
      default: 'medium',
    },
    mood: {
      type: String,
      enum: ['good', 'normal', 'low'],
      default: 'normal',
    },
    symptoms: { type: [String], default: [] },
    notes:    { type: String, default: '' },
    date:     { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const Cycle = mongoose.model('Cycle', cycleSchema);
export default Cycle;