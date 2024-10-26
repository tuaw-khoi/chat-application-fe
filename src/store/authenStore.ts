import { create } from "zustand";

export type isAuthenticated = true | false | null;
export type AdminType = 0 | 1 | null;
type isAuthenticatedModalType = {
  authen: isAuthenticated;
};
type isAuthenticatedActionType = {
  setAuthen: (authentication: isAuthenticated) => void;
};
export type testRFType = number;
type testRFModalType = {
  test: testRFType;
};
type testRFActionType = {
  setTest: (authentication: testRFType) => void;
};

type AminModalType = {
  isAdmin: AdminType;
};
type AdminActionType = {
  setIsAdmin: (authentication: AdminType) => void;
};

const useAuthenStore = create<
  isAuthenticatedModalType &
    isAuthenticatedActionType &
    AminModalType &
    AdminActionType &
    testRFModalType &
    testRFActionType
>((set) => ({
  authen: false,
  isAdmin: null,
  test: 0,
  setTest: (isAuthenticated: testRFType) => set({ test: isAuthenticated }),
  setAuthen: (isAuthenticated: isAuthenticated) =>
    set({ authen: isAuthenticated }),
  setIsAdmin: (authenticationType: AdminType) =>
    set({ isAdmin: authenticationType }),
}));

export default useAuthenStore;
