import mongoose from 'mongoose';

const reportValueSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    value:      { type: String, required: true },
    unit:       { type: String, default: '' },
    confidence: { type: Number, min: 0, max: 100, default: 95 },
    status:     { type: String, enum: ['low', 'high', 'normal', 'info'], default: 'normal' },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type:        { type: String, required: true, trim: true },
    date:        { type: Date, required: true, default: Date.now },
    fileName:    { type: String, default: '' },
    values:      { type: [reportValueSchema], default: [] },
    explanation: { type: String, default: '' },
    reviewed:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;