import { Edit, Information } from "@carbon/icons-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiPost } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ChevronLeft } from "@carbon/icons-react";

const AgentProfile = () => {
  const { id } = useParams();
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAgentData = () => {
    setLoading(true);
   const onSuccess = (response) => {
     setAgentData(response.data[0]);
     setLoading(false);
   };

   const onFailure = (error) => {
     setLoading(false);
   };

   apiPost("/agent-stats", onSuccess, onFailure, { agent_id: id });
 };



  useEffect(() => {
    fetchAgentData();
  }, [id]);


  const handleEditField = (field) => {
    

    Swal.fire({
      title: `Edit ${field}`,
      input: 'text',
      inputValue: agentData[field],
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: (value) => {
        // Implement edit functionality here

        return new Promise((resolve , reject) => {

          const onSuccess =  (response) => {
            toast.success(response?.data?.message || "Field updated successfully");
            fetchAgentData();
            resolve();
          } ;
  
          const onFailure = (error) => {
            Swal.showValidationMessage(`Request failed: ${error?.response?.data?.message}`);
            // toast.error(error?.response?.data?.message || "Failed to update field");
            reject();
          };
  
          var formdata = new FormData();
          formdata.append("agent_id", id);
  
  
          if (field === "name") {
            formdata.append("name", value);
          } 
          
          else if (field === "phone") {
            formdata.append("phone", value);
          }
          
  
          apiPost(`/agent-update`, onSuccess, onFailure, formdata);
        })
      }
    })
  };


  const HandleActivationStatus = (status) => {
      Swal.fire({
      title: `${status === 1 ? 'Activate' : 'Deactivate'} Agent?`,
      text: `Are you sure you want to ${status === 1 ? 'activate' : 'deactivate'} this agent?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        
        return new Promise((resolve , reject) => {
          
          const onSuccess = (response) => {
            // toast.success(response?.data?.message || "Status updated successfully");
            fetchAgentData();
            resolve();
          } ;
          
          const onFailure = (error) => {
            reject();
            toast.error(error?.response?.data?.message || "Failed to update status");
          };
          
          apiPost(`/agent-status-update`, onSuccess, onFailure, { agent_id: id, status });
        })        
      }
    })
  }



  if (loading) {
    return <Spinner />;
  }

  if (!agentData) {
    return <div>Agent not found</div>;
  }

  return (
    <div className="addTeamWrp">
      <div className="uk-container">
      <div className="backbtn">
            <button type="button" onClick={() => navigate(-1)}>
              <ChevronLeft /> Back
            </button>
          </div>
        <div className="uk-margin" uk-grid="">
          <div className="agent-profile-container">
            {/* Basic Info Card */}
            <div className="agent-basic-info">
              <div className="agent-avatar">
                <img src={agentData.photo || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}  alt={agentData.name}  onError={(e) => (e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')} />
              </div>

              <div className="agent-status-wrapper">
                <div
                  className={`status-indicator ${
                    agentData.status === 1 ? "active" : ""
                  }`}
                ></div>
                <span>{agentData.status === 1 ? "Active" : "Inactive"}</span>
              </div>

              <div className="agent-name">
                {agentData.name}
                <button
                  className="edit-button"
                  onClick={() => handleEditField("name")}
                >
                  <Edit size={16} />
                </button>
              </div>
              <div className="agent-role">
                {agentData.user_type}
                {/* <button className="edit-button">
                  <Edit size={16} />
                </button> */}
              </div>

              <div className="agent-contact">
                <div className="phone-input">
                  <p>
                    Phone : <span> {agentData.phone}</span>{" "}
                  </p>
                  <span>
                    <button
                      className="edit-button"
                      onClick={() => handleEditField("phone")}
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
                      checked={agentData.status === 1}
                      onChange={(e) => HandleActivationStatus(agentData.status === 1 ? 0 : 1)}
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
                    <span className="label">Total Surveys :</span>
                    <span className="value"> {agentData.call_statistics.total_survey}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Active :</span>
                    <span className="value success">
                      {" "}
                      {agentData.call_statistics.calls_active}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Pending :</span>
                    <span className="value success">
                      {" "}
                      {agentData.call_statistics.pending_calls}
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
                    <span className="value">{agentData.last_login_at}</span>
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
              {agentData.assigned_surveys.map((survey) => (
                <div key={survey.survey_id}>
                  <Link
                    to={`/company-survey/${survey.survey_id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="companyCard">
                      <div className="profileImage">
                        <img
                          src={survey.survey_image}
                          alt={survey.survey_name}
                          onError={(e) => {
                            e.target.src = "https://randomuser.me/api/portraits/women/2.jpg";
                          }}
                        />
                      </div>
                      <div className="userInfo">
                        <h3>{survey.survey_name}</h3>
                        <a className="role">View Details</a>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
