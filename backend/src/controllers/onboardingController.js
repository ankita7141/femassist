import User from '../models/User.js';

// @desc    Get current user's onboarding data
// @route   GET /api/onboarding
// @access  Private
export async function getOnboarding(req, res, next) {
  try {
    res.json(req.user.onboarding);
  } catch (error) {
    next(error);
  }
}

// @desc    Update onboarding (partial save supported)
// @route   PUT /api/onboarding
// @access  Private
export async function updateOnboarding(req, res, next) {
  try {
    const allowed = [
      'age', 'dob', 'lifeStage',
      'hasPeriods', 'lastPeriodDate', 'avgCycleLength', 'avgPeriodDuration',
      'height', 'weight', 'bloodGroup', 'conditions', 'allergies', 'medications',
      'sleep', 'activity',
      'goals',
      'consentAccepted',
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[`onboarding.${key}`] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Onboarding updated',
      onboarding: user.onboarding,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Mark onboarding as complete
// @route   POST /api/onboarding/complete
// @access  Private
export async function completeOnboarding(req, res, next) {
  try {
    // Basic sanity — require minimum fields
    const o = req.user.onboarding;
    if (!o.consentAccepted) {
      res.status(400);
      throw new Error('Consent must be accepted before completing onboarding');
    }
    if (!o.lifeStage) {
      res.status(400);
      throw new Error('Life stage is required');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'onboarding.completed': true,
          'onboarding.completedAt': new Date(),
        },
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Onboarding complete',
      onboarding: user.onboarding,
    });
  } catch (error) {
    next(error);
  }
}