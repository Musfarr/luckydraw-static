import { Edit, Information } from "@carbon/icons-react";
import React from "react";
import { Link } from "react-router-dom";

const AgentProfile = () => {
  return (
    <div className="addTeamWrp">
      <div className="uk-container">
        <div className="addTeamHeading">
          <h3>Add User</h3>
        </div>
        <div className="uk-margin" uk-grid="">
          <div className="agent-profile-container">
            {/* Basic Info Card */}
            <div className="agent-basic-info">
              <div className="agent-avatar">
                {/* <img src={agentData?.photo} alt={agentData?.name} /> */}
                <img
                  src="https://randomuser.me/api/portraits/women/2.jpg"
                  alt=""
                />
              </div>

              <div className="agent-status-wrapper">
                {/* <div
                  className={`status-indicator ${
                    agentData?.status === 1 ? "active" : ""
                  }`}
                ></div> */}
                <div className={`status-indicator active`}></div>
                {/* <span>{agentData?.status === 1 ? "Active" : "Inactive"}</span> */}
                <span>Active</span>
              </div>

              <div className="agent-name">
                {/* {agentData?.name} */}
                Musfer hassan
                <button
                  className="edit-button"
                //   onClick={() => handleEditField("name")}
                >
                  <Edit size={16} />
                </button>
              </div>
              <div className="agent-role">
                {/* {agentData?.user_type}   */}
                Sales Agent
                <button className="edit-button">
                  {/* <Edit size={16} /> */}
                </button>
              </div>

              <div className="agent-contact">
                <div className="phone-input">
                  {/* <p>
                    Phone : <span> {agentData?.phone}</span>{" "}
                  </p> */}
                  <p>
                    Phone : <span>03102368352</span>{" "}
                  </p>
                  <span>
                    <button
                      className="edit-button"
                    //   onClick={() => handleEditField("phone")}
                    >
                      <Edit size={16} />
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Agent Profile Card */}
            <div className="agent-profile-details ">
              <div className="card-header  ">
                <h3>
                  Agent profile
                  <Information size={16} />
                </h3>
                <div className="activate-switch">
                  <span>Activate</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                    //   checked={agentData?.status === 1}
                    //   onChange={(e) => handleStatusUpdate(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="workload-section sec-divider">
                <h4>
                Workload
                  <Information size={16} />
                </h4>
                <div className="workload-stats">
                  <div className="stat-item">
                    <span className="label">Total Campaigns :</span>
                    {/* <span className="value"> {agentData?.totalCampaigns}</span> */}
                    <span className="value">4</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Active :</span>
                    <span className="value success">
                      {" "}
                      {/* {agentData?.activeCampaigns} */}
                      4
                    </span>
                  </div>
                </div>
              </div>

              <div className="workload-section ">
                <h4 className="">
                  Account information
                  <Information size={16} />
                </h4>
                <div className="account-info">
                  <div className="inf-row">
                    <span className="label">Last login : </span>
                    {/* <span className="value">{agentData?.last_login_at}</span> */}
                    <span className="value">2025-02-18 22:33:02</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cardbox">
          <div className="cardHeading">
            <span>Assign Survey</span>
          </div>

          <div className="uk-padding-small">
            <div className="uk-grid uk-grid-medium" uk-grid="">
              <div>
                <Link
                  to="#"
                //   to={`/company-profile/${id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="companyCard">
                    <div className="profileImage">
                      {/* <img src={photo} alt={name} /> */}
                      <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="" />
                    </div>
                    <div className="userInfo">
                      {/* <h3>{name}</h3> */}
                      <h3>company name</h3>
                      <a className="role">View Details</a>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
