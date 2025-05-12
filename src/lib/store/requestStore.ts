import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RequestStatus = 'draft' | 'submitted' | 'in_progress' | 'review' | 'completed' | 'cancelled';
export type RequestStage = 'requirements' | 'design' | 'development' | 'testing' | 'delivery';

export interface WebsiteRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: RequestStatus;
  currentStage: RequestStage;
  progress: number;
  createdAt: number;
  updatedAt: number;
  collaboratorIds: string[];
  // Form fields
  businessName?: string;
  businessType?: string;
  targetAudience?: string;
  designPreferences?: {
    colorScheme?: string;
    layoutPreference?: string;
    styleReferences?: string[];
  };
  functionalRequirements?: string[];
  budget?: number;
  deadline?: number;
}

interface RequestState {
  currentRequest: WebsiteRequest | null;
  formStep: number;
  setCurrentRequest: (request: WebsiteRequest | null) => void;
  updateCurrentRequest: (updates: Partial<WebsiteRequest>) => void;
  setFormStep: (step: number) => void;
  resetForm: () => void;
}

export const useRequestStore = create<RequestState>()(
  persist(
    (set) => ({
      currentRequest: null,
      formStep: 1,
      setCurrentRequest: (request) => set({ currentRequest: request }),
      updateCurrentRequest: (updates) => 
        set((state) => ({ 
          currentRequest: state.currentRequest 
            ? { ...state.currentRequest, ...updates } 
            : null 
        })),
      setFormStep: (step) => set({ formStep: step }),
      resetForm: () => set({ currentRequest: null, formStep: 1 }),
    }),
    {
      name: 'request-store',
    }
  )
); 