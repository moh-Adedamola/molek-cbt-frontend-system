const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'molek_cbt_token';
const USER_KEY = import.meta.env.VITE_USER_KEY || 'molek_cbt_user';

// Token management
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// User management
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Clear all auth data
export const clearAuthData = () => {
  removeToken();
  removeUser();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};