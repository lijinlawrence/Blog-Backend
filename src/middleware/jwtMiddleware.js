import jwt from 'jsonwebtoken';

const extractUserId = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is missing in authorization header' });
    }

    const decodedToken = jwt.verify(token, 'secretkey123'); // Use your JWT secret
    req.payload = decodedToken.userId;
    next();
  } catch (error) {
    console.error('Error in JWT middleware:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default extractUserId;
