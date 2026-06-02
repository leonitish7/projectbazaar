import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

// Helper function to extract user ID from JWT token
const getUserIdFromToken = (request: NextRequest) => {
    try {
        // Try to get the token from various places
        let token = null;

        // 1. Try Authorization header
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.replace('Bearer ', '');
        }

        // 2. If no token in Authorization header, try cookies
        if (!token) {
            const tokenCookie = request.cookies.get('token');
            if (tokenCookie) {
                token = tokenCookie.value;
            }
        }

        if (!token) {
            console.log('No token found in request');
            return null;
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key') as { id: string };
        console.log('Successfully decoded token, user ID:', decoded.id);
        return decoded.id;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
            userId: clientProvidedUserId, // Rename to distinguish it from the token-derived userId
            cartItems // Accept cart items if sent from client
        } = body;

        // Get user ID from token - this is more secure
        const tokenUserId = getUserIdFromToken(request);
        console.log('Token user ID:', tokenUserId);
        console.log('Client-provided user ID:', clientProvidedUserId);

        // Verify the payment signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
        }

        // Connect to MongoDB
        await dbConnect();

        // Update the order status in database
        const filter = { orderId };
        const update = {
            status: 'completed',
            paymentId: razorpay_payment_id,
            // If we have a valid user ID from the token, use it to update the order's userId
            ...(tokenUserId && { userId: tokenUserId }),
            // If additional cart details are provided in the request, update them
            ...(cartItems && { items: cartItems })
        };

        console.log('Updating order with:', {
            filter,
            update,
            tokenUserId
        });

        // First, find the order to check its current state
        const existingOrder = await Order.findOne(filter).exec();
        if (existingOrder) {
            console.log('Found existing order:', existingOrder);

            // If the order has a 'guest' userId and we have a valid tokenUserId, update it
            if (existingOrder.userId === 'guest' && tokenUserId) {
                console.log('Updating guest order to user:', tokenUserId);
                update.userId = tokenUserId;
            }
        }

        const updatedOrder = await Order.findOneAndUpdate(
            filter,
            update,
            { new: true }
        ).exec();

        if (!updatedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // Log successful payment and data storage
        console.log('Payment successful, order data stored:', updatedOrder);

        return NextResponse.json({
            message: 'Payment verified successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({
            message: 'Error verifying payment',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}