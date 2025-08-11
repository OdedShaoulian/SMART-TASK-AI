// server/src/routes/profile-form.tsx
import { Request, Response, Router } from 'express';
import { getAuth } from '@clerk/express';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;

    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error('Missing Clerk secret key');
    }

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user from Clerk');
    }

    const user = await response.json();

    return res.status(200).json({
      name,
      user,
    });
  } catch (error: any) {
    console.error('Error in profile form handler:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
