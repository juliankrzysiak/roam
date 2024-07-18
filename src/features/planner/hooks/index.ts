import { MutableRefObject, useEffect } from "react";

export function useDetectOutsideClick(
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
}
