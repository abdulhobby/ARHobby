import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ==================== HELPER FUNCTION ====================

const verifyTokenAndGetUser = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  return { decoded, user };
};

// ==================== USER AUTH MIDDLEWARE ====================

export const protectUser = async (req, res, next) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized. Please login.'
      });
    }

    const { user } = await verifyTokenAndGetUser(token);

    if (!user || user.role !== 'user' || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive user account'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('❌ User auth error:', error.message);

    return res.status(401).json({
      success: false,
      message: error.name === 'TokenExpiredError'
        ? 'Session expired. Please login again.'
        : 'Invalid user token'
    });
  }
};

// ==================== ADMIN AUTH MIDDLEWARE ====================

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Admin not authorized. Please login.'
      });
    }

    const { user } = await verifyTokenAndGetUser(token);

    if (!user || user.role !== 'admin' || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive admin account'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('❌ Admin auth error:', error.message);

    return res.status(401).json({
      success: false,
      message: error.name === 'TokenExpiredError'
        ? 'Session expired. Please login again.'
        : 'Invalid admin token'
    });
  }
};

// ==================== ROLE-BASED AUTHORIZATION ====================

export const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// ==================== ADMIN ONLY ====================

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access only'
    });
  }

  next();
};

// ==================== OPTIONAL AUTH ====================

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.userToken || req.cookies.adminToken;

    if (!token) {
      req.isAuthenticated = false;
      return next();
    }

    const { user } = await verifyTokenAndGetUser(token);

    if (user && user.isActive) {
      req.user = user;
      req.isAuthenticated = true;
    } else {
      req.isAuthenticated = false;
    }

  } catch (error) {
    console.error('❌ Optional auth error:', error.message);
    req.isAuthenticated = false;
  }

  next();
};

// ==================== OWNERSHIP CHECK ====================

export const checkOwnership = (paramId = 'id') => {
  return (req, res, next) => {
    try {
      const resourceId = req.params[paramId];

      if (
        req.user._id.toString() !== resourceId &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource'
        });
      }

      next();

    } catch (error) {
      console.error('❌ Ownership error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ownership verification failed'
      });
    }
  };
};

// ==================== RATE LIMITING ====================

const requestCounts = new Map();

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const requests = requestCounts.get(key);
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Try again later.',
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
      });
    }

    validRequests.push(now);
    requestCounts.set(key, validRequests);

    // Cleanup memory
    if (requestCounts.size > 10000) {
      requestCounts.clear();
    }

    next();
  };
};

// ==================== REQUEST LOGGER ====================

export const logRequest = (req, res, next) => {
  console.log('📝 Request:', {
    time: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    user: req.user ? req.user._id : 'anonymous'
  });

  next();
};

// ==================== ASYNC HANDLER ====================

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
