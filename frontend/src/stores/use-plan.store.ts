import { create, type StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type { IPlan } from "../models/response/IPlan";
import { PlanService } from "../services/plan.service";

interface IActions {
  createPlan: (
    duration: string,
    price: number,
    description?: string,
  ) => Promise<IPlan | null>;

  updatePlan: (
    id: string,
    duration: string,
    price: number,
    description?: string,
  ) => Promise<IPlan | null>;

  deletePlan: (id: string) => Promise<IPlan | null>;

  getPlans: () => Promise<IPlan[]>;
}

interface IInitialState {
  plans: IPlan[];
  isLoading: boolean;
  error: string | null;
}

interface IPlanState extends IInitialState, IActions {}

const initialState: IInitialState = {
  plans: [],
  isLoading: false,
  error: null,
};

const planStore: StateCreator<
  IPlanState,
  [["zustand/devtools", never], ["zustand/persist", unknown]]
> = (set) => ({
  ...initialState,

  createPlan: async (duration, price, description): Promise<IPlan | null> => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await PlanService.createPlan(
        duration,
        price,
        description,
      );

      const newPlan = response.data;

      set((state) => ({
        plans: [...state.plans, newPlan],
        isLoading: false,
        error: null,
      }));

      return newPlan;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create plan";

      set({
        error: message,
        isLoading: false,
      });

      return null;
    }
  },

  updatePlan: async (
    id,
    duration,
    price,
    description,
  ): Promise<IPlan | null> => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await PlanService.updatePlan(
        id,
        duration,
        price,
        description,
      );

      const updatedPlan = response.data;

      set((state) => ({
        plans: state.plans.map((plan) => (plan.id === id ? updatedPlan : plan)),
        isLoading: false,
        error: null,
      }));

      return updatedPlan;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update plan";

      set({
        error: message,
        isLoading: false,
      });

      return null;
    }
  },

  deletePlan: async (id): Promise<IPlan | null> => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await PlanService.deletePlan(id);

      const deletedPlan = response.data;

      set((state) => ({
        plans: state.plans.filter((plan) => plan.id !== id),
        isLoading: false,
        error: null,
      }));

      return deletedPlan;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete plan";

      set({
        error: message,
        isLoading: false,
      });

      return null;
    }
  },

  getPlans: async (): Promise<IPlan[]> => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await PlanService.getPlans();

      set({
        plans: response.data,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get plans";

      set({
        error: message,
        isLoading: false,
      });

      return [];
    }
  },
});

export const usePlanStore = create<IPlanState>()(
  devtools(
    persist(planStore, {
      name: "plan-storage",

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        plans: state.plans,
      }),
    }),
  ),
);

export const usePlans = () => usePlanStore((state) => state.plans);

export const useIsLoading = () => usePlanStore((state) => state.isLoading);

export const useError = () => usePlanStore((state) => state.error);

export const createPlan = (
  duration: string,
  price: number,
  description?: string,
) => usePlanStore.getState().createPlan(duration, price, description);

export const updatePlan = (
  id: string,
  duration: string,
  price: number,
  description?: string,
) => usePlanStore.getState().updatePlan(id, duration, price, description);

export const deletePlan = (id: string) =>
  usePlanStore.getState().deletePlan(id);

export const getPlans = () => usePlanStore.getState().getPlans();
