// server/src/controllers/clerkController.ts
import { Request, Response } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const testClerkConnection = async (req: Request, res: Response) => {
  try {
    const users = await clerkClient.users.getUserList({ limit: 1 });
    res.json({ success: true, users });
  } catch (error: any) {
    console.error("Clerk connection failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
