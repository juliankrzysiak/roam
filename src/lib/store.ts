import { create } from "zustand";

type State = {
  currentPlace: {
    id?: string;
    placeId: string | null;
    position: google.maps.LatLngLiteral;
  } | null;
};

type Actions = {
  updateCurrentPlace: (currentPlace: State) => void;
  reset: () => void;
};

const initialState: State = {
  currentPlace: null,
};

export const useCurrentPlaceStore = create<State & Actions>((set) => ({
  ...initialState,
  updateCurrentPlace: (currentPlace: State) => {
    set(currentPlace);
  },
  reset: () => {
    set(initialState);
  },
}));
