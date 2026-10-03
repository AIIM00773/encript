import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface User {
  id: number |string;

  username: string;

  email: string | null;

  firstName: string | null;
  lastName: string | null;

  phone: string | null;

  country: string | null;

  avatarUrl: string | null;

  bio: string | null;

  isVerified: boolean;

  isEmailVerified: boolean;

  isPhoneVerified: boolean;

  role: "user" | "admin";

  status: "active" | "suspended" | "pending";

  createdAt: string;

  lastSeenAt: string;

  timezone: string;

  language: string;

  preferences: {
    emailNotifications: boolean;
    securityNotifications: boolean;
    marketingEmails: boolean;
    darkMode: boolean;
  };

};






export interface SignUpPayload {
  username: string;
  email: string;
  phone: string | null;
  password: string;
};




export interface SignInPayload {
  username: string;
  password: string;
};




export interface UserContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;

  signUp: (payload: SignUpPayload) => Promise<void>;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => void;

  updateUser: (updates: Partial<User>) => void;
}



/* -------------------------------------------------------------------------- */
/* Dev User                                                           */
/* -------------------------------------------------------------------------- */

/*
 * Development-only authenticated user.
 *
 * This allows the dashboard to be developed independently from the
 * authentication API.
 */


const DEFAULT_DEV_USER: User = {
  id: 1,

  username: "fredrick",

  email: "fredrick@example.com",

  firstName: "Fredrick",

  lastName: "Juma",

  phone: "+254 700 000 000",

  country: "Kenya",

  avatarUrl: null,

  bio: "Building private, secure communication tools with Encript.",

  isVerified: true,

  isEmailVerified: true,

  isPhoneVerified: false,

  role: "user",

  status: "active",

  createdAt: "2026-09-01T08:00:00.000Z",

  lastSeenAt: new Date().toISOString(),

  timezone: "Africa/Nairobi",

  language: "en",

  preferences: {
    emailNotifications: true,
    securityNotifications: true,
    marketingEmails: false,
    darkMode: true,
  },
};



/* -------------------------------------------------------------------------- */
/* Dev configuration                                                  */

/*
 * During frontend development we keep the dashboard authenticated.
 *
 * Set VITE_USE_DEV_USER=false when you want to test the unauthenticated
 * application state.
 */


const USE_DEV_USER = import.meta.env.DEV && import.meta.env.VITE_USE_DEV_USER !== "false";




/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const UserContext = createContext<UserContextValue | undefined>(undefined);



/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export const UserProvider = ({children,}: {children: ReactNode;}) => {
  const [user, setUser] = useState<User | null>(USE_DEV_USER ? DEFAULT_DEV_USER : null,);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(USE_DEV_USER);
  const [isLoading, setIsLoading] = useState(false);


  /* ------------------------------------------------------------------------ */
  /* Sign up                                                                  */
  /* ------------------------------------------------------------------------ */

  const signUp = async (payload: SignUpPayload): Promise<void> => {
    setIsLoading(true);

    try {
      console.log("Sign-up payload:", payload);

      /*
       * TODO:
       *
       * const response = await fetch(
       *   `${import.meta.env.VITE_API_URL}/api/auth/register/`,
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json",
       *     },
       *     body: JSON.stringify(payload),
       *   },
       * );
       */

      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Sign in                                                                  */
  /* ------------------------------------------------------------------------ */

  const signIn = async (payload: SignInPayload): Promise<void> => {
    setIsLoading(true);

    try {
      console.log("Sign-in payload:", payload);

      /*
       * TODO:
       *
       * Authenticate against the backend and then populate:
       *
       * setUser(...)
       * setIsAuthenticated(true)
       */

      await new Promise((resolve) => setTimeout(resolve, 500));

      setUser(DEFAULT_DEV_USER);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Sign out                                                                 */
  /* ------------------------------------------------------------------------ */

  const signOut = (): void => {
    setUser(null);
    setIsAuthenticated(false);
  };

  /* ------------------------------------------------------------------------ */
  /* Update user                                                               */
  /* ------------------------------------------------------------------------ */

  const updateUser = (updates: Partial<User>): void => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      return {
        ...currentUser,
        ...updates,
      };
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Context value                                                             */
  /* ------------------------------------------------------------------------ */

  const value = useMemo<UserContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      signUp,
      signIn,
      signOut,
      updateUser,
    }),
    [isAuthenticated, isLoading, user],
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used within a UserProvider.",
    );
  }

  return context;
};