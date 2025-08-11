import { redirect } from 'react-router';
import { getAuth } from '@clerk/react-router/ssr.server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import type { Route } from './+types/profile';

export async function loader(args: Route.LoaderArgs) {
  // Use `getAuth()` to get the user's ID
  const { userId } = await getAuth(args);

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return redirect('/sign-in?redirect_url=' + args.request.url);
  }

  // Ensure the Clerk secret key is available
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('Missing Clerk secret key');
  }

  // Use clerkClient to fetch user data
  const user = await clerkClient.users.getUser(userId);  // Get user info by userId

  return {
    user: JSON.stringify(user),  // Return the user object
  };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Profile Data</h1>
      <pre>
        <code>{JSON.stringify(loaderData, null, 2)}</code>
      </pre>
    </div>
  );
}
