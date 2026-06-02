import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Custom from '@/models/Custom';
import AdminAction from '@/models/AdminAction';

export async function POST(
    request: NextRequest,
    { params }: { params: { requestId: string } }
) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Get custom request ID from URL parameter
        const requestId = params.requestId;

        if (!requestId) {
            return NextResponse.json(
                { message: 'Request ID is required' },
                { status: 400 }
            );
        }

        // Parse the request body
        const data = await request.json();
        const { isCompleted } = data;

        // First, check if custom request exists
        const customRequest = await Custom.findById(requestId);
        if (!customRequest) {
            return NextResponse.json(
                { message: 'Custom request not found' },
                { status: 404 }
            );
        }

        // Get user ID from the email (since custom requests use email, not userId)
        // This helps us track the user across different actions
        const userIdentifier = customRequest.email;

        // Then, update or create the admin action
        const adminAction = await AdminAction.findOneAndUpdate(
            {
                userId: userIdentifier,
                itemId: requestId,
                itemType: 'custom'
            },
            {
                userId: userIdentifier,
                itemId: requestId,
                itemType: 'custom',
                isCompleted: isCompleted ?? false,
                actionDate: new Date()
            },
            {
                upsert: true,
                new: true
            }
        );

        // If the admin marks the request as completed, also update the custom request status
        if (isCompleted && customRequest.status !== 'completed') {
            await Custom.findByIdAndUpdate(
                requestId,
                { status: 'completed' },
                { new: true }
            );
        } else if (!isCompleted && customRequest.status === 'completed') {
            // If marking as incomplete, update to pending
            await Custom.findByIdAndUpdate(
                requestId,
                { status: 'pending' },
                { new: true }
            );
        }

        return NextResponse.json({
            message: 'Custom request action updated successfully',
            action: adminAction
        });
    } catch (error) {
        console.error('Error updating custom request action:', error);
        return NextResponse.json(
            {
                message: 'Error updating custom request action',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}