import Otp from "./db/model/otpModel";
const validityPeriodMinutes = parseInt(
  process.env.OTP_VALIDITY_PERIOD_MINUTES || "5"
);
const OTP_SIZE = parseInt(process.env.OTP_SIZE || "4");

const generateOTP = (size: number) => {
  if (size < 1 && size > 10) {
    throw new Error("Invalid OTP size");
  }

  const min = 10 ** (size - 1);
  const max = 10 ** size - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const otpController = {
  generateOtp: async (email: string) => {
    try {
      // Check if an OTP has already been generated for this email
      const existingOtp = (await Otp.findOne({
        email: email,
        createdAt: {
          $gte: new Date(new Date().getTime() - validityPeriodMinutes * 60000),
        },
      })) as { email: string; otp: number };

      if (existingOtp) {
        return existingOtp.otp;
      }

      const otp = generateOTP(OTP_SIZE);

      const otpDocument = new Otp({
        email: email,
        otp: otp,
        createdAt: new Date(),
      });

      await otpDocument.save();

      return otp;
    } catch (error: any) {
      console.error(error);
      throw new Error("Failed to generate OTP");
    }
  },
  verifyOtp: async (email: string, otp: number) => {
    try {
      if (otp.toString().length !== OTP_SIZE) {
        throw new Error("Invalid OTP");
      }

      const otpDocument = await Otp.findOneAndDelete({
        email: email,
        otp: otp,
        createdAt: {
          $gte: new Date(new Date().getTime() - validityPeriodMinutes * 60000),
        },
      }).lean();

      if (!otpDocument) {
        throw new Error("Invalid OTP");
      }

      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  clearExpiredOtps: async () => {
    try {
      // Clear expired OTPs
      const cutoffTime = new Date(
        new Date().getTime() - validityPeriodMinutes * 60000
      );
      await Otp.deleteMany({ createdAt: { $lt: cutoffTime } });
    } catch (error: any) {
      throw new Error("Failed to clear expired OTPs");
    }
  },
};

export default otpController;