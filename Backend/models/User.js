import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  FullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: String, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const UserModal = mongoose.model('User', userSchema);
export default UserModal;
