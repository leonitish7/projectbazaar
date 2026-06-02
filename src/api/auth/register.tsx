
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;
    
    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Connect to MongoDB
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    const newUser = new User({ name, email });
    newUser.setPassword(password);
    await newUser.save();
    
    // Return success without exposing sensitive information
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ 
      message: 'Error registering user', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
