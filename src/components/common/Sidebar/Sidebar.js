import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Add, AddAlt, AssetView, ChartBar, Dashboard, Home, ListCheckedMirror, Logout, Mobile, Phone, TableOfContents, UserAvatar } from "@carbon/icons-react";
import siderbarLogo from "../../../assets/images/favicon.svg";
import LogoutModal from "../../Modal/LogoutModal";
import { useAuth } from "../../../Context/AuthProvider";
import UIkit from "uikit";
import Swal from "sweetalert2";
import { apiPost } from "../../../Utils/apiServices";
import sidelogo from "../../../assets/images/sidebarlogo.png";


const Sidebar = () => {
  const { auth } = useAuth();
  const role = auth?.user?.user_type;


  const logout = () => {
    Swal.fire({
      title: 'Logout ?',
      text: "Are you sure you want to logout ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {


        // apiPost(`/Call_Center_Apis/api/logout`,
        //   (response) => {
        //     if (response) {
        //       localStorage.clear();
        //       window.location.href = '/';
        //     }
        //   },
        //   (error) => {
        //     console.log(error);
        //   },
        //   {
        //     cc_id: user.cc_id,
        //     admin_id: user.admin_id
        //   }
        // );
      }
    })
  }

  const AdminRoutes = () => {
    return (
      <>
      <li>
  <NavLink
    className="character-btn"
    to="/call-center"
  >
    <Dashboard />
    <span>Call Center</span>
  </NavLink>
</li>
<li>
  <NavLink
    className="character-btn"
    to="/social-media"
  >
    <ChartBar />
    <span>Social Media</span>
  </NavLink>
</li>
<li>
  <NavLink
    className="character-btn"
    to="/activations"
  >
    <UserAvatar />
    <span>Activations</span>
  </NavLink>
</li>


      {/* <li>
        <NavLink
          className="character-btn"
          to="/reports"
        >
          <Document />
          <span>Reports</span>
        </NavLink>
      </li>


      <li>
        <NavLink
          className="character-btn"
          to="/outbound"
          
        >
          < PhoneOutgoing/>
          <span>Outbound</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="character-btn"
          to="/add-notification"
          
        >
          <Notification />
          <span>Notification</span>
        </NavLink>
      </li>
      
      <li>
        <NavLink
          className="character-btn"
          to="/user"
          
        >
          <UserAvatar />
          <span>User</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          className="character-btn"
          to="/work-code"

        >
          <Document />
          <span>Work Code</span>
        </NavLink>
      </li> */}
      {/* <li>
        <NavLink
          className="character-btn"
          to="/chat"
          
        >
          <Chat />
          <span>Chat</span>
        </NavLink>
      </li> */}
    </>
    )
  }


  const AgentRoutes = () => {
    return (
      <li>
        <li>
              <Link
                className="character-btn"
                to="/dashboard"
                uk-tooltip="title: Home; pos: right"
              >
                <Home />
              </Link>
        </li>

        <li>
              <Link
                className="character-btn"
                to="/audit-survey"
                uk-tooltip="title: Audit; pos: right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
                    fill="#b9b9b9"
                  />
                </svg>
              </Link>
            </li>

        </li>
    )
  }


  const getSidebarLinks = () => {
    if (auth?.user?.user_type === 'admin') {
      return <AdminRoutes />;
    } else if (auth?.user?.user_type === 'agent') {
      return <AgentRoutes />;
    } else {
      return null;
    }
  };


  const getHomeRoute = () => {
    switch (role) {
      case 'super_admin':
        return '/superadminhome';
      case 'admin':
        return '/admin-home';
      case 'company':
        return '/dashboard';
      default:
        return '/';
    }
  };

  

  return (
    <>
      <nav className="sideNav">
        <div className="logowrp">
          <img src={'/assets/images/sidebarlogo.svg'} width={180} alt="" />
        </div>

        <div className="navwrp">
          <ul>
            <li>
              <NavLink className="character-btn" to={getHomeRoute()}>
                <TableOfContents />
                <span >Dashboard</span>
              </NavLink>
            </li>

            {/* Super Admin Links */}
            {/* {role === 'super_admin' && renderSuperAdminLinks()} */}

            {/* Admin Links */}
            {role === 'admin' && AdminRoutes()}  


            {/* Company Links */}
            {/* {role === 'company' && renderCompanyLinks()} */}


            <li>
              <Link className="character-btn" onClick={() => logout()}>
                <Logout />
                <span >Logout</span>
              </Link>
            </li>
          </ul>


          <ul className="scnd-navwrp">
            
            
          </ul>
        </div>
        
      </nav>
    </>
  );
};

export default Sidebar;
