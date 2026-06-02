import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define a type for the JWT payload
interface JwtPayload {
  id: string;
  [key: string]: unknown;
}

// Helper function to extract user ID from JWT token
export const getUserIdFromToken = (request: NextRequest) => {
  // Get the token from cookies or authorization header
  const token = request.cookies.get('token')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    return (decoded as JwtPayload).id;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};
