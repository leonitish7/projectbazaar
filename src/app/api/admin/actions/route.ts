import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AdminAction from '@/models/AdminAction';

export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type');
        const ids = searchParams.get('ids')?.split(',') || [];

        if (!type || ids.length === 0) {
            return NextResponse.json(
                { message: 'Type and at least one ID are required' },
                { status: 400 }
            );
        }

        // Validate type parameter
        if (type !== 'order' && type !== 'custom') {
            return NextResponse.json(
                { message: 'Type must be either "order" or "custom"' },
                { status: 400 }
            );
        }

        // Fetch admin actions for the specified items
        const actions = await AdminAction.find({
            itemType: type,
            itemId: { $in: ids }
        });

        return NextResponse.json({ actions });
    } catch (error) {
        console.error('Error fetching admin actions:', error);
        return NextResponse.json(
            {
                message: 'Error fetching admin actions',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}