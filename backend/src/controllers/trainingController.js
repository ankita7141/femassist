import TrainingProgress from '../models/TrainingProgress.js';

// @desc    Mark a lesson complete and save quiz score
// @route   POST /api/training/:lessonId/complete
// @access  Private
export async function completeLesson(req, res, next) {
  try {
    const { lessonId } = req.params;
    const { score } = req.body || {};

    if (!lessonId) {
      res.status(400);
      throw new Error('Lesson ID is required');
    }

    const update = {
      completed: true,
      completedAt: new Date(),
    };
    if (score !== undefined) {
      if (score < 0 || score > 100) {
        res.status(400);
        throw new Error('Score must be between 0 and 100');
      }
      update.score = score;
    }

    const progress = await TrainingProgress.findOneAndUpdate(
      { user: req.user._id, lessonId },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(progress);
  } catch (error) {
    next(error);
  }
}

// @desc    Get all training progress for current user
// @route   GET /api/training/progress
// @access  Private
export async function getProgress(req, res, next) {
  try {
    const progress = await TrainingProgress.find({ user: req.user._id }).sort({
      completedAt: -1,
    });

    // Return as an object keyed by lessonId for easy frontend lookup
    const map = {};
    progress.forEach((p) => {
      map[p.lessonId] = {
        completed: p.completed,
        score: p.score,
        completedAt: p.completedAt,
      };
    });

    res.json(map);
  } catch (error) {
    next(error);
  }
}

// @desc    Get progress for a single lesson
// @route   GET /api/training/progress/:lessonId
// @access  Private
export async function getProgressByLesson(req, res, next) {
  try {
    const { lessonId } = req.params;

    const progress = await TrainingProgress.findOne({
      user: req.user._id,
      lessonId,
    });

    if (!progress) {
      return res.json({ completed: false, score: null, completedAt: null });
    }

    res.json({
      completed: progress.completed,
      score: progress.score,
      completedAt: progress.completedAt,
    });
  } catch (error) {
    next(error);
  }
}