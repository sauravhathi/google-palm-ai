import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "./db/config";
import AccessKey from "./db/models/accessKeyModel";
import isValidEmail from "./utils/isValidEmail";

connectDB();

const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const randomizeEmail = (email: string): string => {
  const parts = email.split("@");
  if (parts.length === 2) {
    const username = parts[0];
    const randomizedUsername = generateRandomString(username.length + 30);
    return randomizedUsername;
  }
  return email;
};

const generateAccessKey = async (email: string): Promise<string> => {
  try {
    const randomizedEmail = randomizeEmail(email);
    const randomString = generateRandomString(10);
    const accessKey = `sh_${randomizedEmail}_${randomString}`;
    return accessKey;
  } catch (error) {
    console.error("Error generating access key:", error);
    throw error;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const email = req.body.email.trim().toLowerCase() as string;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const isExisting = await await AccessKey.findOne({ email });

  if (isExisting) {
    return res.status(400).json({
      error: `Email already exists, your access key is: ${isExisting.accessKey}`,
    });
  }

  const accessKey = await generateAccessKey(email);

  await AccessKey.create({
    accessKey,
    email,
  });

  return res.status(200).json({ accessKey });
}
