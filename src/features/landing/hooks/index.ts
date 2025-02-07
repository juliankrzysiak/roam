import { MutableRefObject, useEffect, useRef, useState } from "react";

type IntersectionObserverOptions = {
  root: Element;
  rootMargins: string;
  threshold: number | number[];
  once: boolean;
};

export function useIntersection(
  options?: Partial<IntersectionObserverOptions>,
) {
  const intersectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const currentRef = intersectionRef.current;
    const observer = new IntersectionObserver(intersectionCallback, options);
    if (intersectionRef.current) observer.observe(intersectionRef.current);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
    function intersectionCallback(entries: IntersectionObserverEntry[]) {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
      if (options?.once && isVisible && intersectionRef.current)
        observer.unobserve(intersectionRef.current);
    }
  }, [options]);

  const tuple: [MutableRefObject<null>, boolean] = [intersectionRef, isVisible];

  return tuple;
}
