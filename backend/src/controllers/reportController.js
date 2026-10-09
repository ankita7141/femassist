import Report from '../models/Report.js';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export async function createReport(req, res, next) {
  try {
    const body = req.body || {};

    if (!body.type) {
      res.status(400);
      throw new Error('Report type is required');
    }

    const report = await Report.create({
      user: req.user._id,
      type: body.type,
      date: body.date || new Date(),
      fileName: body.fileName || '',
      values: body.values || [],
      explanation: body.explanation || '',
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}

// @desc    Get all reports for current user
// @route   GET /api/reports
// @access  Private
export async function getReports(req, res, next) {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
}

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
export async function getReportById(req, res, next) {
  try {
    console.log("Report ID:", req.params.id);
    console.log("Logged-in User ID:", req.user._id);

    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    console.log("Found Report:", report);

    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
}

// @desc    Mark report as reviewed
// @route   PUT /api/reports/:id/reviewed
// @access  Private
export async function markReportReviewed(req, res, next) {
  try {
    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { reviewed: true } },
      { new: true }
    );

    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
}

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
export async function deleteReport(req, res, next) {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }

    res.json({ message: 'Report deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
}