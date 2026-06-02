import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // No authentication check for development

        // Get all orders with most recent first
        const orders = await Order.find().sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json(
            {
                message: 'Error fetching orders',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}