import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      userId  // Accept userId from the client if user is logged in
    } = req.body;

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Connect to MongoDB
    await dbConnect();

    // Update the order status in database
    const filter = { orderId };
    const update = {
      status: 'completed',
      paymentId: razorpay_payment_id,
      // Update userId if provided (user is logged in)
      ...(userId && userId !== 'guest' ? { userId } : {})
    };

    // Fix the TypeScript error by using the correct function signature
    const updatedOrder = await Order.findOneAndUpdate(
      filter,
      update,
      { new: true }
    ).exec();

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({
      message: 'Payment verified successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      message: 'Error verifying payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
