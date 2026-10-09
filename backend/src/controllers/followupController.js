import User from '../models/User.js';
import Report from '../models/Report.js';
import Symptom from '../models/Symptom.js';
import Cycle from '../models/Cycle.js';
import TrainingProgress from '../models/TrainingProgress.js';

const GOAL_TO_LESSON = {
  anemia: 'hemoglobin',
  pcos: 'pcos-basics',
  menstrual: 'cycle-basics',
  nutrition: 'iron-rich-foods',
  mental: 'sleep-hormones',
  menopause: 'menopause-intro',
};

// Compute follow-ups based on current user data
function computeFollowUps(user, data) {
  const { reports, symptoms, cycles, progress } = data;
  const dismissed = user.dismissedFollowUps || [];
  const list = [];

  // 1. Reports newer than 7 days without being reviewed
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  reports.forEach((r) => {
    const id = `report-${r._id}`;
    if (new Date(r.date).getTime() > weekAgo && !r.reviewed && !dismissed.includes(id)) {
      list.push({
        id,
        icon: '🧪',
        type: 'report',
        title: `Review ${r.type}`,
        detail: 'Uploaded in the last 7 days. Check the extracted values.',
        reportId: r._id,
      });
    }
  });

  // 2. Recommended lesson
  const goal = (user.onboarding?.goals || []).find((g) => GOAL_TO_LESSON[g]);
  if (goal) {
    const lessonId = GOAL_TO_LESSON[goal];
    const id = `lesson-${lessonId}`;
    if (!progress[lessonId]?.completed && !dismissed.includes(id)) {
      list.push({
        id,
        icon: '📚',
        type: 'training',
        title: 'Complete your recommended lesson',
        detail: 'Tailored to your health goals. Takes about 2 minutes.',
        lessonId,
      });
    }
  }

  // 3. Cycle log
  if (user.onboarding?.hasPeriods) {
    if (cycles.length === 0) {
      const id = 'cycle-first';
      if (!dismissed.includes(id)) {
        list.push({
          id,
          icon: '🌸',
          type: 'cycle',
          title: 'Log your first cycle',
          detail: 'Start tracking to see patterns in mood and energy.',
        });
      }
    } else {
      const last = new Date(cycles[0].date).getTime();
      if (Date.now() - last > 30 * 24 * 60 * 60 * 1000) {
        const id = 'cycle-30';
        if (!dismissed.includes(id)) {
          list.push({
            id,
            icon: '🌸',
            type: 'cycle',
            title: 'Time to log your cycle',
            detail: "It's been over 30 days since your last cycle log.",
          });
        }
      }
    }
  }

  // 4. Symptom check-in
  if (symptoms.length === 0) {
    const id = 'symptoms-first';
    if (!dismissed.includes(id)) {
      list.push({
        id,
        icon: '📝',
        type: 'symptom',
        title: 'Log how you feel today',
        detail: 'A quick check-in helps spot patterns over time.',
      });
    }
  } else {
    const lastTime = new Date(symptoms[0].date).getTime();
    if (Date.now() - lastTime > 7 * 24 * 60 * 60 * 1000) {
      const id = 'symptoms-week';
      if (!dismissed.includes(id)) {
        list.push({
          id,
          icon: '📝',
          type: 'symptom',
          title: 'Weekly symptom check-in',
          detail: "It's been a week since your last log.",
        });
      }
    }
  }

  return list;
}

// @desc    Get computed follow-ups for current user
// @route   GET /api/followups
// @access  Private
export async function getFollowUps(req, res, next) {
  try {
    const [reports, symptoms, cycles, progressDocs] = await Promise.all([
      Report.find({ user: req.user._id }).sort({ date: -1 }),
      Symptom.find({ user: req.user._id }).sort({ date: -1 }),
      Cycle.find({ user: req.user._id }).sort({ date: -1 }),
      TrainingProgress.find({ user: req.user._id }),
    ]);

    const progress = {};
    progressDocs.forEach((p) => {
      progress[p.lessonId] = {
        completed: p.completed,
        score: p.score,
      };
    });

    const list = computeFollowUps(req.user, { reports, symptoms, cycles, progress });

    res.json(list);
  } catch (error) {
    next(error);
  }
}

// @desc    Dismiss a follow-up (won't show again for this user)
// @route   POST /api/followups/:id/dismiss
// @access  Private
export async function dismissFollowUp(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error('Follow-up ID is required');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { dismissedFollowUps: id } },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Follow-up dismissed',
      id,
      dismissedFollowUps: user.dismissedFollowUps,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Reset all dismissed follow-ups (for testing / settings)
// @route   POST /api/followups/reset
// @access  Private
export async function resetFollowUps(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { dismissedFollowUps: [] } },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Follow-ups reset',
      dismissedFollowUps: user.dismissedFollowUps,
    });
  } catch (error) {
    next(error);
  }
}