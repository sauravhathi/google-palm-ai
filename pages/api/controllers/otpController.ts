import Otp from "../db/models/otpModel";

const parseEnvInt = (envVar: string, defaultValue: number) => {
  const value = parseInt(process.env[envVar] || "");
  return isNaN(value) ? defaultValue : value;
};

const validityPeriodMinutes = parseEnvInt("OTP_VALIDITY_PERIOD_MINUTES", 5);
const OTP_SIZE = parseEnvInt("OTP_SIZE", 4);
const MAX_OTP_ATTEMPTS = parseEnvInt("MAX_OTP_ATTEMPTS", 3);
const MAX_OTP_ATTEMPTS_PERIOD_MINUTES = parseEnvInt("MAX_OTP_ATTEMPTS_PERIOD_MINUTES", 30);


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

      const otpDocumentCountBefore = await Otp.countDocuments({
        email: email,
        createdAt: {
          $gte: new Date(
            new Date().getTime() - MAX_OTP_ATTEMPTS_PERIOD_MINUTES * 60000
          ),
        },
      });

      if (otpDocumentCountBefore >= MAX_OTP_ATTEMPTS) {
        throw new Error(`Maximum ${MAX_OTP_ATTEMPTS} OTP attempts exceeded. Please try again after ${MAX_OTP_ATTEMPTS_PERIOD_MINUTES} minutes.`);
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
      throw new Error(error.message);
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
