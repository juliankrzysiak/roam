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
  }, []);
}

export function useShortcut(shortcut: string[], callback: () => void) {
  const pressedKeys = new Set();
  const handleShortcut = (e: KeyboardEvent) => {
    pressedKeys.add(e.key);
    const hasShortcut = shortcut.every((e) => pressedKeys.has(e));
    if (hasShortcut) {
      callback();
    }
  };
  const removeKey = (e: KeyboardEvent) => {
    pressedKeys.delete(e.key);
  };
  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);
    document.addEventListener("keyup", removeKey);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("keyup", removeKey);
    };
  }, []);
}
