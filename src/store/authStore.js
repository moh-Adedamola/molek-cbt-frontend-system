import { create } from 'zustand';
import { authService } from '../api/services/authService';
import { setToken, setUser, clearAuthData, getUser, getToken } from '../utils/storage';

export const useAuthStore = create((set, get) => ({
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,

  // Login action
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      console.log('🔐 Store login called with:', { ...credentials, password: '***' });

      const response = await authService.login(credentials);

      console.log('📥 Login response:', response);

      // Extract token and user from response
      let token, user;

      if (response.data) {
        // Structure: { data: { user, token } }
        token = response.data.token || response.data.accessToken;
        user = response.data.user;
      } else if (response.token) {
        // Structure: { token, user }
        token = response.token || response.accessToken;
        user = response.user;
      } else {
        console.error('❌ Unexpected response structure:', response);
        throw new Error('Invalid response from server');
      }

      if (!token || !user) {
        console.error('❌ Missing token or user:', { token: !!token, user: !!user });
        throw new Error('Invalid response from server');
      }

      console.log('✅ Token and user extracted successfully');

      // Save to localStorage
      setToken(token);
      setUser(user);

      // Update state
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      console.log('✅ Store updated successfully');

      return { success: true };
    } catch (error) {
      console.error('❌ Store login error:', error);
      set({
        error: error.message || 'Login failed',
        loading: false,
      });
      return { success: false, error: error.message };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  // Load user from token
  loadUser: async () => {
    const token = getToken();
    if (!token) {
      set({ isAuthenticated: false, loading: false });
      return;
    }

    const existingUser = getUser();
    if (!existingUser) {
      set({ loading: true });
    }

    try {
      const response = await authService.me();
      console.log('Me response:', response); // DEBUG

      let user;
      if (response.data?.user) {
        user = response.data.user;
      } else if (response.data) {
        user = response.data;
      } else if (response.user) {
        user = response.user;
      } else {
        throw new Error('Invalid user data');
      }

      setUser(user);
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Load user error:', error);
      clearAuthData();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  // Change password
  changePassword: async (data) => {
    set({ loading: true, error: null });
    try {
      await authService.changePassword(data);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({
        error: error.message || 'Password change failed',
        loading: false,
      });
      return { success: false, error: error.message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Update user
  updateUser: (userData) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, ...userData };
    setUser(updatedUser);
    set({ user: updatedUser });
  },
}));