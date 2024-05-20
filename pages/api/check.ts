import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "./db/config";
import escapeRegExp from "@/lib/escapeRegExp";
import AccessKey from "./db/models/accessKeyModel";

connectDB();

async function updateAccessKey(_id: string, maxRequests: number, expiresAt: Date) {
    try {
        const accessKey = await AccessKey.findOneAndUpdate(
            { _id },
            { maxRequests, expiresAt, updatedAt: new Date() },
            { new: true }
        );
        return accessKey;
    }
    catch (error) {
        console.error("Error updating access key:", error);
        throw error;
    }
}

async function getAllAccessKeys(search?: string, page: number = 1) {
    try {
        const query = {} as any;
        if (search && search.length > 0) {
            query["email"] = { $regex: new RegExp(escapeRegExp(search), "i") };
        }
        if (page < 1) {
            page = 1;
        }
        const totalPage = await AccessKey.countDocuments(query);
        const accessKeys = await AccessKey.find(query)
            .sort({ createdAt: -1 })
            .limit(10)
            .skip((page - 1) * 10);
        return {
            page,
            totalPage,
            search,
            accessKeys,
        };
    }
    catch (error) {
        console.error("Error getting all access keys:", error);
        throw error;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const sh = req.query.sh as string;

    if (sh !== "si") {
        return res.status(403).json({ error: "Forbidden" });
    }

    if (req.method === "PATCH") {
        const { _id, maxRequests, expiresAt } = req.body;
        if (!_id || !maxRequests || !expiresAt) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const updatedAccessKey = await updateAccessKey(_id, maxRequests, new Date(expiresAt));

        if (!updatedAccessKey) {
            return res.status(400).json({ message: "Something went wrong", status: false });
        }

        return res.status(200).json({ message: "Access key updated", status: true});
    }

    if (req.method === "GET") {
        const { search, page } = req.query;
        const accessKeys = await getAllAccessKeys(search as string, Number(page));
        return res.status(200).json(accessKeys);
    }

    return res.status(405).json({ error: "Method not allowed" });
}