import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));
