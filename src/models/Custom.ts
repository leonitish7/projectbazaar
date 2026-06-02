import mongoose, { Schema, Document } from 'mongoose';

// Define the Custom Project Request interface
export interface ICustomRequest extends Document {
    name: string;
    email: string;
    phone?: string;
    projectType: string;
    projectCategory: string;
    description: string;
    budget?: number;
    timeline?: string;
    requirements?: string;
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'completed';
    createdAt: Date;
}

const CustomRequestSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    projectType: { type: String, required: true, trim: true },
    projectCategory: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget: { type: Number },
    timeline: { type: String },
    requirements: { type: String },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

// Create and export the model
const CustomRequest = mongoose.models.CustomRequest || mongoose.model<ICustomRequest>('CustomRequest', CustomRequestSchema);

export default CustomRequest;