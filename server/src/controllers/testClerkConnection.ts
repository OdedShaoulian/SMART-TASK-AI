// server/src/controllers/clerkController.ts

import { Request, Response } from "express";
import { getAuth } from "@clerk/express";

export const testClerkConnection = (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    message: "✅ Clerk authentication is working",
    userId,
  });
};
