
import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IUser extends Document {
  email: string;
  name: string;
  hashedPassword: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
  setPassword: (password: string) => void;
  validatePassword: (password: string) => boolean;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Method to set user password
UserSchema.methods.setPassword = function(password: string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hashedPassword = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

// Method to validate password
UserSchema.methods.validatePassword = function(password: string) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.hashedPassword === hash;
};

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
