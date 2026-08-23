import { create, type StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { AuthService } from "../services/auth.service";
import { API_URL } from "../http";
import { type AuthResponse } from "../models/response/authResponse";
import axios from "axios";

interface IUser {
  id: string;
  name: string;
  email: string;
  isActivated: boolean;
}

interface IActions {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface IInitialState {
  user: IUser | null;
  isAuth: boolean;
  isLoading: boolean;
}

interface IUserState extends IInitialState, IActions {}

const initialState: IInitialState = {
  user: null,
  isAuth: false,
  isLoading: true,
};

const userStore: StateCreator<
  IUserState,
  [["zustand/devtools", never], ["zustand/persist", unknown]]
> = (set) => ({
  ...initialState,
  login: async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("token", response.data.accessToken);
      set(
        {
          user: response.data.user,
          isAuth: true,
          isLoading: false,
        },
        false,
        "login",
      );
    } catch (error) {
      console.log(`Login error: ${error}`);
    }
  },
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await AuthService.register(name, email, password);
      localStorage.setItem("token", response.data.accessToken);
      set(
        {
          user: response.data.user,
          isAuth: true,
          isLoading: false,
        },
        false,
        "register",
      );
    } catch (error) {
      console.log(`Register errog: ${error}`);
    }
  },
  logout: async () => {
    set({
      user: null,
      isAuth: false,
    });
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      set(
        {
          user: null,
          isAuth: false,
        },
        false,
        "logout",
      );
    } catch (error) {
      console.log(`Logout errog: ${error}`);
    }
  },
  checkAuth: async () => {
    try {
      const response = await axios.get<AuthResponse>(
        `${API_URL}/auth/refresh`,
        {
          withCredentials: true,
        },
      );

      localStorage.setItem("token", response.data.accessToken);

      set({
        user: response.data.user,
        isAuth: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isAuth: false,
        isLoading: false,
      });

      console.log(error);
    }
  },
});

export const useUserStore = create<IUserState>()(
  devtools(
    persist(userStore, {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuth: state.isAuth,
      }),
    }),
  ),
);

export const useUser = () => useUserStore((state) => state.user);
export const useIsAuth = () => useUserStore((state) => state.isAuth);
export const useIsLoading = () => useUserStore((state) => state.isLoading);
export const registerUser = (name: string, email: string, password: string) =>
  useUserStore.getState().register(name, email, password);
export const loginUser = (email: string, password: string) =>
  useUserStore.getState().login(email, password);
export const logoutUser = () => useUserStore.getState().logout();
export const checkAuth = () => useUserStore.getState().checkAuth();
