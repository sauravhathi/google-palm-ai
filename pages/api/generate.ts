import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import { NextApiRequest, NextApiResponse } from "next";
import AccessKey from "./db/model/accessKeyModel";
import connectDB from "./db/config";

connectDB();

type SafetySetting = {
  category: string;
  threshold: number;
};

type TextGenerationOptions = {
  model: string;
  temperature: number;
  candidateCount: number;
  top_k: number;
  top_p: number;
  max_output_tokens: number;
  stop_sequences: string[];
  safety_settings: SafetySetting[];
};

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(process.env.API_KEY || ""),
});

const options: TextGenerationOptions = {
  model: "models/text-bison-001",
  temperature: 0.5,
  candidateCount: 1,
  top_k: 50,
  top_p: 0.95,
  max_output_tokens: process.env.MAX_OUTPUT_TOKENS
    ? parseInt(process.env.MAX_OUTPUT_TOKENS)
    : 1024,
  stop_sequences: [],
  safety_settings: [
    { category: "HARM_CATEGORY_DEROGATORY", threshold: 1 },
    { category: "HARM_CATEGORY_TOXICITY", threshold: 1 },
    { category: "HARM_CATEGORY_VIOLENCE", threshold: 2 },
    { category: "HARM_CATEGORY_SEXUAL", threshold: 2 },
    { category: "HARM_CATEGORY_MEDICAL", threshold: 2 },
    { category: "HARM_CATEGORY_DANGEROUS", threshold: 2 },
  ],
};

const cache = new Map<string, any>();
const generationLocks = new Map<string, Promise<any>>();

async function checkAccessKey(authorizationHeader: string) {
  if (!authorizationHeader) {
    throw new Error("Unauthorized");
  }

  const accessKey = await AccessKey.findOne({ accessKey: authorizationHeader });

  if (!accessKey) {
    throw new Error("Unauthorized");
  }

  if (accessKey.expiresAt && accessKey.expiresAt < new Date()) {
    throw new Error("Access key expired at " + accessKey.expiresAt);
  }

  if (
    accessKey.maxRequests &&
    accessKey.totalRequests &&
    accessKey.totalRequests >= accessKey.maxRequests
  ) {
    throw new Error("Max requests reached");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = (req.body as { prompt: string }) || { prompt: "" };
  const promptString = `${prompt}`.trim().replace(/\n{2,}/g, "\n");

  try {
    await checkAccessKey(req.headers.authorization as string);

    if (generationLocks.has(promptString)) {
      try {
        const cachedData = await generationLocks.get(promptString);
        return res.status(200).json(cachedData);
      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    if (cache.has(promptString)) {
      const cachedData = cache.get(promptString);
      return res.status(200).json(cachedData);
    }

    const generationPromise = (async () => {
      try {
        const data = await client.generateText({
          ...options,
          prompt: {
            text: promptString,
          },
        });
        cache.set(promptString, data);
        return data;
      } catch (error) {
        throw error;
      } finally {
        generationLocks.delete(promptString);
      }
    })();

    generationLocks.set(promptString, generationPromise);

    try {
      const data = await generationPromise;
      const accessKey = await AccessKey.findOne({
        accessKey: req.headers.authorization as string,
      });
      if (accessKey) {
        accessKey.totalRequests = accessKey.totalRequests + 1;
        await accessKey.save();
      }
      res.status(200).json(data);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error: any) {
    console.error("Error:", error);
    res.status(401).json({ error: error.message });
  }
}
