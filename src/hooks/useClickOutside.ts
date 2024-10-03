import blurStore from "@/store/blurStore";
import focusStore from "@/store/focusStore";
import searchFoundStore from "@/store/userFoundStore";
import { useEffect, useRef } from "react";

function useClickOutside(type: string) {
  const { setSearchUser } = searchFoundStore();
  const ref = useRef<HTMLDivElement>(null);
  const { isBlur, setBlur } = blurStore();
  const { setFocus } = focusStore();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (type === "notification") {
          setBlur(true);
          setFocus(false);
        } else if (type === "addnewfriend") {
          setSearchUser(null);
        }
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
