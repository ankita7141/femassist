import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symptoms: { type: [String], default: [] },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild',
    },
    notes: { type: String, default: '' },
    date:  { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const Symptom = mongoose.model('Symptom', symptomSchema);
export default Symptom;