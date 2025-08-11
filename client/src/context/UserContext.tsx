import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';  // Use `import type` for type-only imports
import { useUser } from '@clerk/clerk-react';

const UserContext = createContext<UserResource | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

interface UserResource {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user } = useUser();
  const [currentUser, setCurrentUser] = useState<UserResource | null>(null);

  useEffect(() => {
    if (user) {
      setCurrentUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress || null,  // Get the first email address or null if none
      });
    } else {
      setCurrentUser(null);
    }
  }, [user]);

  return <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>;
};

export default UserContext;
