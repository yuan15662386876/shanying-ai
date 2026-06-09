"use client";

import { create } from "zustand";

export interface RewriteStyle {
  id: string;
  name: string;
  label: string;
  description: string;
  system_prompt: string;
}

interface WorkspaceState {
  // Step tracking
  currentStep: number;
  setStep: (step: number) => void;

  // Step 1: Content
  sourceUrl: string;
  sourceText: string;
  inputMode: "url" | "text";
  fetchedTitle: string;
  fetchedContent: string;
  isFetching: boolean;
  fetchError: string;
  setSourceUrl: (url: string) => void;
  setSourceText: (text: string) => void;
  setInputMode: (mode: "url" | "text") => void;
  setFetchedContent: (title: string, content: string) => void;
  setIsFetching: (fetching: boolean) => void;
  setFetchError: (error: string) => void;

  // Step 2: Rewrite
  styles: RewriteStyle[];
  selectedStyle: string;
  rewrittenContent: string;
  isRewriting: boolean;
  rewriteError: string;
  setStyles: (styles: RewriteStyle[]) => void;
  setSelectedStyle: (style: string) => void;
  setRewrittenContent: (content: string) => void;
  setIsRewriting: (rewriting: boolean) => void;
  setRewriteError: (error: string) => void;

  // Step 3: Voice (placeholder)
  selectedVoiceId: string;
  setSelectedVoiceId: (id: string) => void;

  // Step 4: Avatar (placeholder)
  selectedAvatarId: string;
  setSelectedAvatarId: (id: string) => void;

  // Step 5: Generate (placeholder)
  isGenerating: boolean;
  videoUrl: string;
  setIsGenerating: (generating: boolean) => void;
  setVideoUrl: (url: string) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  sourceUrl: "",
  sourceText: "",
  inputMode: "url" as const,
  fetchedTitle: "",
  fetchedContent: "",
  isFetching: false,
  fetchError: "",
  styles: [],
  selectedStyle: "viral_marketing",
  rewrittenContent: "",
  isRewriting: false,
  rewriteError: "",
  selectedVoiceId: "",
  selectedAvatarId: "",
  isGenerating: false,
  videoUrl: "",
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  setSourceUrl: (url) => set({ sourceUrl: url, fetchError: "" }),
  setSourceText: (text) => set({ sourceText: text, fetchError: "" }),
  setInputMode: (mode) => set({ inputMode: mode, fetchError: "" }),
  setFetchedContent: (title, content) =>
    set({ fetchedTitle: title, fetchedContent: content, fetchError: "" }),
  setIsFetching: (fetching) => set({ isFetching: fetching }),
  setFetchError: (error) => set({ fetchError: error }),

  setStyles: (styles) => set({ styles }),
  setSelectedStyle: (style) => set({ selectedStyle: style, rewriteError: "" }),
  setRewrittenContent: (content) => set({ rewrittenContent: content, rewriteError: "" }),
  setIsRewriting: (rewriting) => set({ isRewriting: rewriting }),
  setRewriteError: (error) => set({ rewriteError: error }),

  setSelectedVoiceId: (id) => set({ selectedVoiceId: id }),
  setSelectedAvatarId: (id) => set({ selectedAvatarId: id }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setVideoUrl: (url) => set({ videoUrl: url }),

  reset: () => set(initialState),
}));
