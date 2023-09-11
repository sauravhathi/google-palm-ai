import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: Date,
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);