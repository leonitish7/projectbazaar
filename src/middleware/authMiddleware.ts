
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
  };
}

type NextApiHandler = (req: AuthRequest, res: NextApiResponse) => Promise<void> | void;

export const withAuth = (handler: NextApiHandler) => {
  return async (req: AuthRequest, res: NextApiResponse) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const token = authHeader.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'default-secret-key'
      ) as { id: string; email: string };
      
      // Add user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
      
      // Continue to the actual handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};
