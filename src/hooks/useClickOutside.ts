import blurStore from "@/store/blurStore";
import focusStore from "@/store/focusStore";
import { useEffect, useRef } from "react";

function useClickOutside() {
  const ref = useRef<HTMLDivElement>(null);
  const { isBlur, setBlur } = blurStore();
  const { setFocus } = focusStore();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setBlur(true);
        setFocus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBlur]);

  return ref;
}

export default useClickOutside;
