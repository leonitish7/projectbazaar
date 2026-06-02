import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import getRazorpayInstance from '@/lib/razorpay';
import dbConnect from '@/lib/mongodb';
import Order, { IOrderItem } from '@/models/Order';

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
        const { items, userId: clientProvidedUserId } = body;

        // Get user ID from token - this is more secure
        const tokenUserId = getUserIdFromToken(request);
        console.log('Token user ID:', tokenUserId);
        console.log('Client-provided user ID:', clientProvidedUserId);

        // Use token-based user ID if available, fallback to provided userId, or use 'guest' as last resort
        const finalUserId = tokenUserId || clientProvidedUserId || 'guest';
        console.log('Final user ID being used:', finalUserId);

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: 'Invalid cart items' }, { status: 400 });
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
            userId: finalUserId, // Use the determined userId
            items: items as IOrderItem[],
            totalAmount,
            status: 'pending' as const
        };

        // Create a new order document
        const newOrder = new Order(orderDoc);
        await newOrder.save();

        console.log('New order created with userId:', finalUserId);

        // Return the order details to the client
        return NextResponse.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: amountInPaise,
            orderId,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({
            message: 'Error creating order',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}