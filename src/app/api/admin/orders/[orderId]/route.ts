import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PUT(
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
        const { status } = data;

        if (!status) {
            return NextResponse.json(
                { message: 'Status is required' },
                { status: 400 }
            );
        }

        // Find the order and update its status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true } // Return the updated document
        );

        // If order is not found
        if (!updatedOrder) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Return the updated order
        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
            {
                message: 'Error updating order status',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET(
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

        // Find the order by ID
        const order = await Order.findById(orderId);

        // If order is not found
        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Return the order data
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        return NextResponse.json(
            {
                message: 'Error fetching order details',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}