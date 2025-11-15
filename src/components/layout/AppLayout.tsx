import { Outlet } from "react-router-dom";
import TopNav from "@/components/layout/TopNav";
import AppSidebar from "@/components/layout/AppSidebar";

export default function AppLayout() {
  return (
    <>
      <TopNav />
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        <AppSidebar />
        <div className="flex-grow-1" style={{ marginTop: '56px', marginLeft: '250px' }}>
          <main className="container-fluid p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
