import { Outlet } from "react-router-dom";
import { useAuth } from "../../../Context/AuthProvider";
import Sidebar from "./Sidebar";
import DashboardHeader from "../DashboardHeader/DashboardHeader";

const SidebarLayout = ({ userPermissions }) => {
  const { auth } = useAuth();

  return (
    <>
      <Sidebar />
      <DashboardHeader />
      <Outlet context={[]} />
    </>
  );
};

export default SidebarLayout;
