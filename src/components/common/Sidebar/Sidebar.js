import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Logout, Mobile, Phone } from "@carbon/icons-react";
import siderbarLogo from "../../../assets/images/favicon.svg";
import LogoutModal from "../../Modal/LogoutModal";
import { useAuth } from "../../../Context/AuthProvider";
import UIkit from "uikit";

const Sidebar = () => {
  const { auth } = useAuth();
  

  

  return (
    <>
      <nav className="sideNav">
        <div className="logowrp">
          <img src={siderbarLogo} alt="" />
        </div>

        <div className="navwrp">
          <ul>
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
                to="/create-campaign"
                uk-tooltip="title: Create Camapaign; pos: right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                    fill="#b9b9b9"
                  />
                </svg>
              </Link>
            </li>
            <li>
              <Link
                className="character-btn"
                to="/list-campaign"
                uk-tooltip="title: List Camapaign; pos: right"
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
            <li>
              <Link
                className="character-btn"
                to="/units"
                uk-tooltip="title: Units; pos: right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"
                    fill="#b9b9b9"
                  />
                  <path
                    d="M7 12h2v5H7v-5zm8-5h2v10h-2V7zm-4 7h2v3h-2v-3zm0-4h2v2h-2v-2z"
                    fill="#b9b9b9"
                  />
                </svg>
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
