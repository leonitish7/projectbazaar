import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import AdminAction from '@/models/AdminAction';

export async function POST(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Get order ID from URL parameter
        const orderId = params.orderId;

        if (!orderId) {
            return NextResponse.json(
                { message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Parse the request body
        const data = await request.json();
        const { userId, isCompleted } = data;

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        // First, check if order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Then, update or create the admin action
        const adminAction = await AdminAction.findOneAndUpdate(
            {
                userId: userId, // Use the admin's userId from the request body
                itemId: orderId,
                itemType: 'order'
            },
            {
                userId: userId, // Use the admin's userId from the request body
                itemId: orderId,
                itemType: 'order',
                isCompleted: isCompleted ?? false,
                actionDate: new Date()
            },
            {
                upsert: true,
                new: true
            }
        );

        // If the admin marks the order as completed, also update the order status
        if (isCompleted && order.status !== 'completed') {
            await Order.findByIdAndUpdate(
                orderId,
                { status: 'completed' },
                { new: true }
            );
        }

        return NextResponse.json({
            message: 'Order action updated successfully',
            action: adminAction
        });
    } catch (error) {
        console.error('Error updating order action:', error);
        return NextResponse.json(
            {
                message: 'Error updating order action',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}