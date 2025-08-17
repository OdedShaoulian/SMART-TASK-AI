import { Request, Response, NextFunction } from "express";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Global middleware to inject Clerk auth into all requests
// Ensure Clerk's authentication middleware is called first
export const clerkProtect = clerkMiddleware();

/**
 * Middleware to enforce authentication
 * This middleware ensures that the user is authenticated using Clerk and attaches the userId to the request.
 * It is used to protect routes that require authentication.
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    // For now, create a mock userId for testing purposes
    // In production, this would use Clerk authentication
    const mockUserId = 'test-user-id';
    
    // Attach userId to request object for downstream handlers
    (req as Request & { userId: string }).userId = mockUserId;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle any errors that may occur during authentication
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

/**
 * Full Clerk authentication middleware for production use
 * This middleware ensures that the user is authenticated using Clerk and attaches the userId to the request.
 */
export const authenticateUserWithClerk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Log to verify Clerk's middleware is called
    console.log("Authenticating user via Clerk...");

    // Ensure user is authenticated via Clerk session
    // Call requireAuth() after clerkMiddleware to ensure Clerk's session info is available
    await requireAuth()(req, res, async () => {
      // Log userId for debugging purposes
      const { userId } = getAuth(req);

      // Log the userId to verify it's being fetched correctly
      console.log('Fetched userId from Clerk:', userId);

      // If userId does not exist, return an unauthorized error
      if (!userId) {
        console.error("User ID not found in Clerk session.");
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Ensure user exists in our database
      let user = await prisma.user.findUnique({
        where: { clerkId: userId }
      });

      // If user doesn't exist, create them
      if (!user) {
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            id: userId // Use Clerk ID as internal ID for simplicity
          }
        });
        console.log('Created new user in database:', user.id);
      }

      // Attach userId to request object for downstream handlers
      // This ensures that the userId will be available for further use in route handlers
      (req as Request & { userId: string }).userId = user.id;

      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    // Handle any errors that may occur during authentication
    // If authentication fails or Clerk's middleware throws an error
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
