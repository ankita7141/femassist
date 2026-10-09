import mongoose from 'mongoose';

const trainingProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lessonId: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// One progress record per (user, lessonId) — prevents duplicates
trainingProgressSchema.index({ user: 1, lessonId: 1 }, { unique: true });

const TrainingProgress = mongoose.model('TrainingProgress', trainingProgressSchema);
export default TrainingProgress;