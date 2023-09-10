import mongoose from 'mongoose';

const accessKeySchema = new mongoose.Schema({
    accessKey: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    totalRequests: {
        type: Number,
        default: 0,
    },
    maxRequests: {
        type: Number,
        default: 100,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: Date,
});

const AccessKey = mongoose.models.AccessKey || mongoose.model('AccessKey', accessKeySchema);

export default AccessKey;