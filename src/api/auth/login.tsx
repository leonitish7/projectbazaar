
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Connect to MongoDB
    await dbConnect();
    
    // Find the user
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Validate password
    const isValid = user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'default-secret-key', // Use environment variable in production
      { expiresIn: '7d' }
    );
    
    // Return the token and user info
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ 
      message: 'Error during login', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
