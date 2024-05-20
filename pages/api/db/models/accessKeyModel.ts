import mongoose from "mongoose";

const accessKeySchema = new mongoose.Schema({
  accessKey: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"]
  },
  totalRequests: {
    type: Number,
    default: 0,
  },
  maxRequests: {
    type: Number,
    default: process.env.MAX_REQUESTS_API_KEY || 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3);
      return expiresAt;
    },
  },
});

const AccessKey =
  mongoose.models.AccessKey || mongoose.model("AccessKey", accessKeySchema);

export default AccessKey;
