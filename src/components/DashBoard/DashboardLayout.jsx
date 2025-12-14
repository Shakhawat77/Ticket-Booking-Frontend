import { Outlet } from "react-router";
import DashboardSidebar from "../DashboardSidebar/DashboardSidebar";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";


const DashboardLayout = () => {
  return (
    
  <div>
    <Navbar></Navbar>
      <div className="flex min-h-screen">
      
      <DashboardSidebar />
      <main className="flex-1 p-6 bg-base-200">
        <Outlet />
      </main>
    </div>
    <Footer></Footer>
  </div>
  );
};

export default DashboardLayout;
