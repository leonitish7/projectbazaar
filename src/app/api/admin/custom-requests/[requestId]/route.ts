import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CustomRequest from '@/models/Custom';

type RouteParams = {
    params: {
        requestId: string;
    };
};

export async function PUT(
    request: NextRequest,
    context: RouteParams
) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Get request ID from URL parameter
        const requestId = context.params.requestId;

        if (!requestId) {
            return NextResponse.json(
                { message: 'Request ID is required' },
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

        // Find the custom request and update its status
        const updatedRequest = await CustomRequest.findByIdAndUpdate(
            requestId,
            { status: status },
            { new: true } // Return the updated document
        );

        // If request is not found
        if (!updatedRequest) {
            return NextResponse.json(
                { message: 'Custom request not found' },
                { status: 404 }
            );
        }

        // Return the updated request
        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error('Error updating custom request status:', error);
        return NextResponse.json(
            {
                message: 'Error updating custom request status',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}