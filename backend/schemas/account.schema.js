import mongoose from 'mongoose';

// Định nghĩa schema cho User
const accountSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Tạo model từ schema
const account = mongoose.model('account', accountSchema);

export default account;