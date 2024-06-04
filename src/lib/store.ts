import { Place, Popup } from "@/types";
import { create } from "zustand";

type State = {
  popup: Place | Popup | null;
};

type Action = {
  updatePopup: (popup: State["popup"]) => void;
};

export const usePopupStore = create<State & Action>((set) => ({
  popup: null,
  updatePopup: (popup) => set(() => ({ popup: popup })),
}));
