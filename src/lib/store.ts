import { PlaceT } from "@/types";
import { create } from "zustand";

type State = {
  popup: PlaceT | null;
};

type Action = {
  updatePopup: (popup: State["popup"]) => void;
};

const usePopupStore = create<State & Action>((set) => ({
  popup: null,
  updatePopup: (popup) => set(() => ({ popup: popup })),
}));
