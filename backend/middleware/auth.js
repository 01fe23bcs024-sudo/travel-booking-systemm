import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

export const checkAgent = async (req, res, next) => {
  try {
    if (req.user.role !== 'agent' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only agents can access this route'
      });
    }

    if (req.user.role === 'agent') {
      const Agent = (await import('../models/Agent.js')).default;
      const agent = await Agent.findOne({ userId: req.user._id });
      
      if (!agent || !agent.isVerified) {
        return res.status(403).json({
          success: false,
          message: 'Agent account is not verified'
        });
      }
      
      req.agent = agent;
    }

    next();
  } catch (error) {
    next(error);
  }
};


