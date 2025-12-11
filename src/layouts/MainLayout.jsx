import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

const MainLayout = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen eco-gradient">
        <Sidebar />
        <Navbar />
        <main className="ml-64 min-h-screen pt-16">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default MainLayout;
