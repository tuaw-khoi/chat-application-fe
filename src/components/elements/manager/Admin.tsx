import SideBar from "./SideBar";
import DashBoard from "./DashBoard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PageTypeManager from "@/store/managerStore";
import UserManager from "./UserManager";

const AdminManager = () => {
  const { currentPageManager } = PageTypeManager();
  return (
    <div className="flex">
      <div className="max-w-[18%] relative">
        <SidebarProvider>
          <SideBar />
          <main className="absolute -right-8 top-0 z-50 ">
            <SidebarTrigger />
          </main>
        </SidebarProvider>
      </div>
      <div className=" w-full">
        {currentPageManager === "dashboard" ? <DashBoard /> : <UserManager />}
      </div>
    </div>
  );
};

export default AdminManager;
