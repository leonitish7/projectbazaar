import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CustomRequest from '@/models/Custom';
import { getUserIdFromToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Parse the request body
        const data = await request.json();

        // Get user information from token if available
        const userId = getUserIdFromToken(request);

        // Validate required fields
        const requiredFields = ['name', 'email', 'projectType', 'projectCategory', 'description'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { message: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create a new custom project request
        const customRequest = new CustomRequest({
            ...data,
            userId: userId || undefined, // Add user ID if logged in
            status: 'pending'
        });

        // Save to database
        await customRequest.save();

        return NextResponse.json(
            {
                message: 'Custom project request submitted successfully',
                requestId: customRequest._id
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error submitting custom project request:', error);
        return NextResponse.json(
            {
                message: 'Error submitting request',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}