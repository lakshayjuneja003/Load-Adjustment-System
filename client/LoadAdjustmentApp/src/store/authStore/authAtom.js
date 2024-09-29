import { atom, selector } from 'recoil';

// Atom to store the authentication state
export const authAtom = atom({
  key: 'authAtom', // Unique ID for the atom
  default: {
    token: null,  // Stores JWT token
    user: null,   // Stores user details (name, email, role, etc.)
    isAuthenticated: false,  // Tracks if the user is authenticated
  },
});

// Selector to extract token from the state
export const tokenSelector = selector({
  key: 'tokenSelector',
  get: ({ get }) => {
    const authState = get(authAtom);
    return authState.token;
  },
});

// Selector to check if the user is an Admin
export const isAdminSelector = selector({
  key: 'isAdminSelector',
  get: ({ get }) => {
    const authState = get(authAtom);
    return authState.user?.role === 'Admin';
  },
});

// Selector to check authentication status
export const isAuthenticatedSelector = selector({
  key: 'isAuthenticatedSelector',
  get: ({ get }) => {
    const authState = get(authAtom);
    return authState.isAuthenticated;
  },
});
