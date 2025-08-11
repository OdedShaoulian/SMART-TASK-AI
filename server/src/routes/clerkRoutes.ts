// server/src/routes/clerkRoutes.ts
import express from "express";
import { testClerkConnection } from "../controllers/clerkController.js";

const router = express.Router();

// Simple test route to verify Clerk integration is working
router.get("/test-clerk", testClerkConnection);

export default router;
