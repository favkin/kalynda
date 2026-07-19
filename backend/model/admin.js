import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true},
    phone: { type: String, required: true },
    role: { type: String, enum: ['admin']}
}, {timestamps: true});

adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
})

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;

