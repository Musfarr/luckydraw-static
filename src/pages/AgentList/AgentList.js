import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import { apiGet } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";

const AgentList = () => {
  const { auth } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = () => {
      const onSuccess = (response) => {
        setAgents(response.data);
        setLoading(false);
      };

      const onFailure = (error) => {
        console.error("Failed to fetch agents:", error);
        setLoading(false);
      };

      apiGet("/agent-list", onSuccess, onFailure);
    };

    fetchAgents();
  }, []);

  if (loading) {
    return <Spinner />;
  }

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
          {agents.map((agent) => (
            <Link 
              key={agent.id}
              to={`/agent-profile/${agent.id}`} 
              style={{ textDecoration: "none" }}
            >
              <div className="userCard">
                <div className={`status ${agent.login_status}`}>{agent.login_status}</div>
                <div className="profileImage">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    
                  />
                </div>
                <div className="userInfo">
                  <h3>{agent.name}</h3>
                  <a className="role">{agent.user_type}</a>
                  <span className="email">{agent.email}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentList;
