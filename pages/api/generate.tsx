import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import { NextApiRequest, NextApiResponse } from "next";

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

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.API_KEY || '';

const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const options: TextGenerationOptions = {
    model: MODEL_NAME,
    temperature: 0.7,
    candidateCount: 1,
    top_k: 0,
    top_p: 0.95,
    max_output_tokens: 1024,
    stop_sequences: [],
    safety_settings: [
        { "category": "HARM_CATEGORY_DEROGATORY", "threshold": 1 },
        { "category": "HARM_CATEGORY_TOXICITY", "threshold": 1 },
        { "category": "HARM_CATEGORY_VIOLENCE", "threshold": 2 },
        { "category": "HARM_CATEGORY_SEXUAL", "threshold": 2 },
        { "category": "HARM_CATEGORY_MEDICAL", "threshold": 2 },
        { "category": "HARM_CATEGORY_DANGEROUS", "threshold": 2 },
    ],
}

const cache = new Map<string, any>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body as { prompt: string };
    const promptString = `${prompt}`.trim().replace(/\n{2,}/g, "\n");

    if (cache.has(promptString)) {
        const cachedData = cache.get(promptString);
        return res.status(200).json(cachedData);
    }

    try {
        const data = await client.generateText({
            ...options,
            prompt: {
                text: promptString,
            },
        });
        cache.set(promptString, data);

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
}