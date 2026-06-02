
import mongoose, { Schema, Document } from 'mongoose';

// Define the Item interface
export interface IOrderItem {
  projectId: string;
  title: string;
  price: number;
  quantity: number;
  customization?: string;
  category?: string;
  subcategory?: string;
  image?: string;
}

// Define the Order interface extending Document
export interface IOrder extends Document {
  orderId: string;
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  paymentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

const OrderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  items: [{
    projectId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    customization: { type: String },
    category: { type: String },
    subcategory: { type: String },
    image: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  paymentId: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

// Create and export the model
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
