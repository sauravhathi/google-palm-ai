import Otp from "./db/model/otpModel";
import otpController from "./otpController";
import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "./db/config";
import methodNotAllowed from "./methodNotAllowed";


async function otpHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  const email = req.body.email;

  try {
    await connectDB();

    const otp = await otpController.generateOtp(email);

    res.status(200).json({ otp });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export default otpHandler;