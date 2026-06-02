import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // No authentication check for development

        // Get user ID from URL parameter
        const userId = params.userId;

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        // Find the user in the database
        const user = await User.findById(userId).select('name email createdAt');

        // If user is not found
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Return the user data
        return NextResponse.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json(
            {
                message: 'Error fetching user details',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}