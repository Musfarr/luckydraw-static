import { Add, ChevronDown, Logout } from "@carbon/icons-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import userImg from "../../../assets/images/user-img.png";
import LogoutModal from "../../Modal/LogoutModal";
import UIkit from "uikit";
import { useAuth } from "../../../Context/AuthProvider";

const DashboardHeader = () => {
  const { auth } = useAuth();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  if (!auth.token) return null;

  const handleOpenLogoutModal = () => {
    setTimeout(() => {
      setOpenLogoutModal(true);
    }, 1000);
  };

  const handleCloseLogoutModal = () => {
    setOpenLogoutModal(false);
  };

  const closeDrop = () => {
    UIkit.dropdown("#logoutProfileSection").hide();
  };
  return (
    <div className="dashboardHeader">
      <div className="uk-flex uk-flex-middle uk-flex-right" style={{gap: '16px'}}>
      
      
      {auth.user.user_type === 'admin' && (
      <div className="headerBtn">
        <Link to="/create-survey"><Add />Create Survey</Link>
      </div>
      )}


      
        <div className="statusDropdown">
          <div class="uk-inline">
            <button class="statusDropdownBtn" type="button">
              <span className="online"></span>Online <ChevronDown />
            </button>
            <div uk-dropdown="mode: click" className="statusDropdownContent">
              <h6>Chat status</h6>
              <ul>
                <li>
                    <button type="button">
                      <span className="online"></span>
                    <p>Online</p>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="onlineImg">
          <div className="userInfo ">
            <div className="uk-inline">
              <button type="button" className="initialWrapper">
                <span className="SidebarInitialImage">
                  {auth.user.name.charAt(0)}
                </span>
                {/* <img src={userImg} alt="" /> */}
                <span className="icon online"></span>
              </button>

              <div
                uk-dropdown="pos: right-top; mode: click"
                className="navDropDown"
                id="logoutProfileSection"
              >
                <ul className="uk-nav uk-dropdown-nav">
                  <li className="userDetails">
                    <div className="userImg userImgInner initialWrapper">
                      <span className="SidebarInitialImage">
                        {auth.user.name.charAt(0)}
                      </span>
                      {/* <img src={userImg} alt="" /> */}
                      <span className="markProfile onlineMark"></span>
                    </div>
                    <div className="userData">
                      {/* <Link> */}
                      <h4>{auth.user.name}</h4>
                      {/* <p>{auth.user.}</p> */}
                      {/* </Link> */}
                    </div>
                  </li>

                  {/* <li>
                    <a onClick="/">My profile</a>
                  </li>

                  <li>
                    <Link>Account Setting </Link>
                  </li> */}

                  <li>
                    <button
                      type="button"
                      className="logoutBtn"
                      onClick={() => {
                        closeDrop();
                        handleOpenLogoutModal();
                      }}
                    >
                      <Logout /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* <span className="mark onlineMark availableMark"></span> */}
        </div>
      </div>
      {openLogoutModal && <LogoutModal closeModal={handleCloseLogoutModal} />}
    </div>
  );
};

export default DashboardHeader;
