import { atom, selector } from 'recoil';

// Get stored values from localStorage
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

export const authAtom = atom({
  key: 'authAtom',
  default: {
    token: token || null,
    user: user || null,
    isAuthenticated: !!token,
  },
});

// Selector to extract token
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
