import { create } from "zustand";

type PageType = "home" | "phoneBook" | "chat";

interface PageTypeStore {
  currentPage: PageType;
  setPage: (page: PageType) => void;
}

const PageType = create<PageTypeStore>((set) => ({
  currentPage: "home", // Trang mặc định có thể là "home"
  setPage: (page) => set({ currentPage: page }),
}));

export default PageType;
