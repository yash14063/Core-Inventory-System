import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  password: string;
  pendingResetEmail: string | null;
  pendingOtp: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  requestPasswordReset: (email: string) => string;
  verifyOtp: (otp: string) => boolean;
  updatePassword: (newPassword: string) => void;
}

const VALID_USERNAME = "admin";
const INITIAL_PASSWORD = "admin123";

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  username: null,
  password: INITIAL_PASSWORD,
  pendingResetEmail: null,
  pendingOtp: null,
  login: (username, password) => {
    const state = get();
    const ok =
      username.trim() === VALID_USERNAME && password === state.password;
    if (ok) {
      set({ isAuthenticated: true, username });
    }
    return ok;
  },
  logout: () => set({ isAuthenticated: false, username: null }),
  requestPasswordReset: (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    set({ pendingResetEmail: email, pendingOtp: otp });
    return otp;
  },
  verifyOtp: (otp) => {
    const state = get();
    return !!state.pendingOtp && state.pendingOtp === otp;
  },
  updatePassword: (newPassword) => {
    set({ password: newPassword, pendingOtp: null, pendingResetEmail: null });
  },
}));

