
import { NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { withAuth, AuthRequest } from '@/middleware/authMiddleware';

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Get user ID from authenticated request
    const userId = req.user?.id;
    
    // Fetch orders for the authenticated user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).exec();
    
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ 
      message: 'Error fetching orders', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

// Wrap the handler with the authentication middleware
export default withAuth(handler);
