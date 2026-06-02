import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

// Define a type for the JWT payload
interface JwtPayload {
    id: string;
    [key: string]: any; // Allow for other properties
}

// Helper function to extract user ID from JWT token
const getUserIdFromToken = (request: NextRequest) => {
    // Get the token from cookies or authorization header
    const token = request.cookies.get('token')?.value ||
        request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return null;
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
        return (decoded as JwtPayload).id;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};

export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Get user ID from token
        const userId = getUserIdFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized: Please log in to view your orders' },
                { status: 401 }
            );
        }

        // Fetch orders for the authenticated user
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).exec();

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json(
            {
                message: 'Error fetching orders',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}