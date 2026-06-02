import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validate inputs
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists with this email' },
                { status: 409 }
            );
        }

        // Create new user
        const newUser = new User({ name, email });
        newUser.setPassword(password);
        await newUser.save();

        // Return success without exposing sensitive information
        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json(
            {
                message: 'Error registering user',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}