import { create } from "zustand";

type PageTypeManager = "dashboard" | "user";

interface PageTypeManagerStore {
  currentPageManager: PageTypeManager;
  setPageManager: (page: PageTypeManager) => void;
}

const PageTypeManager = create<PageTypeManagerStore>((set) => ({
  currentPageManager: "dashboard",
  setPageManager: (page) => set({ currentPageManager: page }),
}));

export default PageTypeManager;
