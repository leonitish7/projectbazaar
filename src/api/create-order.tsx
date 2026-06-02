
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import getRazorpayInstance from '@/lib/razorpay';
import dbConnect from '@/lib/mongodb';
import Order, { IOrderItem } from '@/models/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { items, userId } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid cart items' });
    }

    // Calculate order amount
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity, 
      0
    );

    // Round to 2 decimal places and convert to paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(totalAmount * 100);
    
    // Create a unique order ID
    const orderId = uuidv4();

    // Initialize Razorpay instance
    const razorpay = getRazorpayInstance();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderId,
    });

    // Connect to MongoDB
    await dbConnect();

    // Save order in pending state
    const orderDoc = {
      orderId,
      userId: userId || 'guest',
      items: items as IOrderItem[],
      totalAmount,
      status: 'pending' as const
    };
    
    // Create a new order document
    const newOrder = new Order(orderDoc);
    await newOrder.save();

    // Return the order details to the client
    return res.status(200).json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: amountInPaise,
      orderId,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      message: 'Error creating order', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
