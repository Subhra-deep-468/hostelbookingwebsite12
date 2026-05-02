const { verifyToken } = require('../config/jwt');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = verifyToken(token);
    const rawId = decoded.id;
    if (rawId == null || decoded.role == null) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    req.user = {
      role: decoded.role,
      id:
        typeof rawId === 'object' && typeof rawId.toString === 'function'
          ? rawId.toString()
          : String(rawId),
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
