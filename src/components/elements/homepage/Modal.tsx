import { useEffect, useRef } from "react";

export const Modal = ({ children, onClose }: any) => {
  const modalRef = useRef<HTMLDivElement | null>(null); // Sửa kiểu cho useRef

  // Xử lý sự kiện nhấn ra ngoài modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &#x2715;
        </button>
        {children}
      </div>
    </div>
  );
};
