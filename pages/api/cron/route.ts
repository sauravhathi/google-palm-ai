import otpController from "../controllers/otpController";
import { NextApiResponse } from "next";

export async function GET(res: NextApiResponse) {
  try {
    await otpController.clearExpiredOtps();
    console.log("Cleared expired OTPs");
    res.status(200).json({ message: "Cleared expired OTPs" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error clearing expired OTPs" });
  }
}