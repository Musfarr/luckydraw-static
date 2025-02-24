import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Add, AddAlt, AssetView, Home, ListCheckedMirror, Logout, Mobile, Phone } from "@carbon/icons-react";
import siderbarLogo from "../../../assets/images/favicon.svg";
import LogoutModal from "../../Modal/LogoutModal";
import { useAuth } from "../../../Context/AuthProvider";
import UIkit from "uikit";




const Sidebar = () => {
  const { auth } = useAuth();
  

  const AdminRoutes = () => {
    return (
      <li>
        <li>
              <Link
                className="character-btn"
                to="/admin-home"
                uk-tooltip="title: Home; pos: right"
              >
                <Home />
              </Link>
        </li>

        <li>
              <Link
                className="character-btn"
                to="/add-user"
                uk-tooltip="title: add-user; pos: right"
              >
                <Add/>
              </Link>
        </li>

        <li>
              <Link
                className="character-btn"
                to="/agent-list"
                uk-tooltip="title: Agents; pos: right"
              >
                <ListCheckedMirror/>
              </Link>
        </li>

        <li>
              <Link
                className="character-btn"
                to="/Assign-survey"
                uk-tooltip="title: Assign Survey; pos: right"
              >
                <AddAlt/>
              </Link>
        </li>

      </li>
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


  

  return (
    <>
      <nav className="sideNav">
        <div className="logowrp">
          <img src={siderbarLogo} alt="" />
        </div>

        <div className="navwrp">
          <ul>
            {/* {getSidebarLinks()} */}

            {auth?.user?.user_type === 'admin' && <AdminRoutes />}
            {auth?.user?.user_type === 'agent' && <AgentRoutes />}

          </ul>
          <ul className="scnd-navwrp">
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
