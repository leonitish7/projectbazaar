import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate inputs
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Connect to MongoDB
        await dbConnect();

        // Find the user
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Validate password
        const isValid = user.validatePassword(password);
        if (!isValid) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'default-secret-key', // Use environment variable in production
            { expiresIn: '7d' }
        );

        // Return the token and user info
        return NextResponse.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json({
            message: 'Error during login',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}