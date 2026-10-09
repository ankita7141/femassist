import Cycle from '../models/Cycle.js';

// @desc    Create cycle log
// @route   POST /api/cycles
// @access  Private
export async function createCycle(req, res, next) {
  try {
    const body = req.body || {};

    const cycle = await Cycle.create({
      user: req.user._id,
      flow: body.flow || 'medium',
      mood: body.mood || 'normal',
      symptoms: body.symptoms || [],
      notes: body.notes || '',
      date: body.date || new Date(),
    });

    res.status(201).json(cycle);
  } catch (error) {
    next(error);
  }
}

// @desc    Get all cycle logs for current user
// @route   GET /api/cycles
// @access  Private
export async function getCycles(req, res, next) {
  try {
    const cycles = await Cycle.find({ user: req.user._id }).sort({ date: -1 });
    res.json(cycles);
  } catch (error) {
    next(error);
  }
}

// @desc    Delete cycle log
// @route   DELETE /api/cycles/:id
// @access  Private
export async function deleteCycle(req, res, next) {
  try {
    const cycle = await Cycle.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cycle) {
      res.status(404);
      throw new Error('Cycle log not found');
    }

    res.json({ message: 'Cycle log deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
}