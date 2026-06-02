import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CustomRequest from '@/models/Custom';

export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // No authentication check for development

        // Get all custom requests with most recent first
        const customRequests = await CustomRequest.find().sort({ createdAt: -1 });

        return NextResponse.json(customRequests);
    } catch (error) {
        console.error('Error fetching custom requests:', error);
        return NextResponse.json(
            {
                message: 'Error fetching custom requests',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}