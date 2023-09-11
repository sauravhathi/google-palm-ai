import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "./db/config";
import otpController from "./otpController";
import methodNotAllowed from "./methodNotAllowed";

async function otpVerifyHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  const { email, otp } = req.body;

  try {
    await connectDB();

    await otpController.verifyOtp(email, otp);

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export default otpVerifyHandler;