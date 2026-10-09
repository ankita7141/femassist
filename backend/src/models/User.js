import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    onboarding: {
      completed: { type: Boolean, default: false },
      completedAt: { type: Date, default: null },

      age: { type: Number, default: null },
      dob: { type: Date, default: null },
      lifeStage: { type: String, default: null },

      hasPeriods: { type: Boolean, default: null },
      lastPeriodDate: { type: Date, default: null },
      avgCycleLength: { type: Number, default: null },
      avgPeriodDuration: { type: Number, default: null },

      height: { type: Number, default: null },
      weight: { type: Number, default: null },

      bloodGroup: { type: String, default: null },
      conditions: { type: String, default: '' },
      allergies: { type: String, default: '' },
      medications: { type: String, default: '' },

      sleep: { type: Number, default: null },
      activity: { type: Number, default: null },

      goals: {
        type: [String],
        default: [],
      },

      consentAccepted: {
        type: Boolean,
        default: false,
      },
    },

    dismissedFollowUps: {
      type: [String],
      default: [],
    },
  },

  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;