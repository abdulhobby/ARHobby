import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export const sendTokenResponse = (user, statusCode, res, type = 'user') => {
  const token = generateToken(user._id);

  const cookieName = type === 'admin' ? 'adminToken' : 'userToken';

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role
  };

  res.status(statusCode)
    .cookie(cookieName, token, cookieOptions)
    .json({
      success: true,
      token,
      user: userData
    });
};