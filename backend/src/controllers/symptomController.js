import Symptom from '../models/Symptom.js';

// @desc    Create symptom log
// @route   POST /api/symptoms
// @access  Private
export async function createSymptom(req, res, next) {
  try {
    const body = req.body || {};

    if (!body.symptoms || !Array.isArray(body.symptoms) || body.symptoms.length === 0) {
      res.status(400);
      throw new Error('At least one symptom is required');
    }

    const symptom = await Symptom.create({
      user: req.user._id,
      symptoms: body.symptoms,
      severity: body.severity || 'mild',
      notes: body.notes || '',
      date: body.date || new Date(),
    });

    res.status(201).json(symptom);
  } catch (error) {
    next(error);
  }
}

// @desc    Get all symptom logs for current user
// @route   GET /api/symptoms
// @access  Private
export async function getSymptoms(req, res, next) {
  try {
    const symptoms = await Symptom.find({ user: req.user._id }).sort({ date: -1 });
    res.json(symptoms);
  } catch (error) {
    next(error);
  }
}

// @desc    Delete symptom log
// @route   DELETE /api/symptoms/:id
// @access  Private
export async function deleteSymptom(req, res, next) {
  try {
    const symptom = await Symptom.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!symptom) {
      res.status(404);
      throw new Error('Symptom log not found');
    }

    res.json({ message: 'Symptom log deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
}