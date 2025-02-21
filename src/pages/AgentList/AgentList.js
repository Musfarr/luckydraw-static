import React from "react";
import { Link } from "react-router-dom";

const AgentList = () => {
  return (
    <div className="addTeamWrp">
      <div className="uk-container uk-container-large">
        <div className="addTeamHeading">
          <h3>Agents</h3>
        </div>

        <div
          className="addTeaBox uk-grid uk-grid-medium uk-child-width-1-4 uk-margin"
          uk-grid=""
        >
          <Link to="" style={{ textDecoration: "none" }}>
            <div className="userCard">
              <div className={`status offline`}>Offline</div>
              <div className="profileImage">
                <img
                  src="https://randomuser.me/api/portraits/women/3.jpg"
                  alt=""
                />
              </div>
              <div className="userInfo">
                <h3>John Doe</h3>
                <a className="role">Sales Agent</a>
                <span className="email">johndoe@example.com</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentList;
