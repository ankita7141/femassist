import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400);
      throw new Error('User with this email already exists');
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      onboarding: user.onboarding,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Need password explicitly because select: false
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      onboarding: user.onboarding,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export async function getMe(req, res, next) {
  try {
    // req.user is set by auth middleware
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      onboarding: req.user.onboarding,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    next(error);
  }
}