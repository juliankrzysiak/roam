import { MutableRefObject, useEffect } from "react";

export function useExit(
  ref: MutableRefObject<null | HTMLElement>,
  callback: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        callback();
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      const key = event.key;
      if (key === "Escape") callback();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  });
}
