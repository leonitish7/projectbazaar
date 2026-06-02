import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // No authentication check for development

        // Get the list of user IDs from query params
        const { searchParams } = new URL(request.url);
        const ids = searchParams.get('ids');

        if (!ids) {
            // If no IDs, return a limited set of users
            const users = await User.find()
                .select('_id name email createdAt')
                .limit(100);

            return NextResponse.json(users);
        }

        // Parse the comma-separated list of user IDs
        const userIds = ids.split(',');

        // Find multiple users by their IDs
        const users = await User.find({
            _id: { $in: userIds }
        }).select('_id name email createdAt');

        // Format the response as an object with userId as keys for easier lookup
        const usersMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            };
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json(usersMap);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            {
                message: 'Error fetching users',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}