import mongoose, { Schema, Document } from 'mongoose';

// Define the AdminAction interface extending Document
export interface IAdminAction extends Document {
    userId: string;
    itemId: string;
    itemType: 'order' | 'custom';
    isCompleted: boolean;
    actionDate: Date;
}

const AdminActionSchema = new Schema({
    userId: { type: String, required: true },
    itemId: { type: String, required: true },
    itemType: {
        type: String,
        enum: ['order', 'custom'],
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    actionDate: { type: Date, default: Date.now }
});

// Create a compound index to ensure uniqueness of actions per user and item
AdminActionSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

// Create and export the model
const AdminAction = mongoose.models.AdminAction || mongoose.model<IAdminAction>('AdminAction', AdminActionSchema);

export default AdminAction;