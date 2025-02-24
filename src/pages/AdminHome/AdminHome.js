import {
  Add,
  Phone,
  PhoneApplication,
  PhoneOff,
  UserServiceDesk,
} from "@carbon/icons-react";
import React, { useState, useEffect } from "react";
import PieChart from "../../components/Graph/PieChart";
import { useAuth } from "../../Context/AuthProvider";
import { apiGet } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";
import { useNavigate } from "react-router-dom";


const AdminHome = () => {

  const navigate = useNavigate();
  const { auth } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = () => {
    setIsLoading(true);
    const onSuccess = (response) => {
      setData(response.data);
      setIsLoading(false);
    };

    const onFailure = (error) => {
      console.error("Failed to fetch dashboard:", error);
      setIsLoading(false);
    };

    apiGet('/admin/dashboard', onSuccess, onFailure);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="boradcastWrp">
      <div className="broadcastContentWrp">
        <div className="overviewContent">
          <div className="uk-container uk-container-large">
            <div className="uk-grid uk-flex-middle" uk-grid="">
              <div className="uk-width-1-1 uk-margin-remove-top">
                <div
                  className="analyticsWhatsappContent"
                  style={{ marginTop: "16px" }}
                >
                  <div className="uk-grid uk-flex-middle" uk-grid="">
                    <div className="uk-width-1-2 uk-margin-remove">
                      <h2 className="uk-margin-remove">Hi , {auth?.user?.name}</h2>
                      <p className="uk-margin-remove">
                        Unilever | Super Admin
                      </p>
                    </div>

                    <div className="uk-width-1-1 uk-margin-remove">
                      <div className="overviewMainContent">
                        <div className="mainBox">
                          <div className="boxHeading">
                            <span>Total Calls Summary</span>
                          </div>
                          <div className="boxContent">
                            <div className="uk-grid" uk-grid="">
                              <div className="uk-width-1-4 uk-first-column">
                                <div className="txtwrp">
                                  <Phone
                                    style={{
                                      fill: "#1F36C7",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2>{data?.total_calls}</h2>
                                  <span>Total Calls</span>
                                </div>
                              </div>
                              <div className="uk-width-1-4">
                                <div className="txtwrp">
                                  <PhoneApplication
                                    style={{
                                      fill: "#1F36C7",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2>{data?.total_pending}</h2>
                                  <span>Total Pending Calls</span>
                                </div>
                              </div>
                              <div className="uk-width-1-4">
                                <div className="txtwrp">
                                  <PhoneOff
                                    style={{
                                      fill: "#A8200D",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2>{data?.failed_rate}%</h2>
                                  <span>Failed Rate</span>
                                </div>
                              </div>
                              <div className="uk-width-1-4">
                                <div className="txtwrp">
                                  <UserServiceDesk
                                    style={{
                                      fill: "#1F36C7",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2>{data?.success_rate}%</h2>
                                  <span>Success Rate</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="uk-grid uk-grid-small" uk-grid="" >
                          <div className="uk-width-1-3">
                            <div className="mainBox">
                              <div className="boxHeading">
                                <span>Total Calls Summary</span>
                              </div>
                              <div className="boxContent">
                                <PieChart
                                  graphData={Object.values(data?.cities || {})}
                                  backgroundColor={[
                                            "#14B8A6",
                                            "#FACC15",
                                            "#F59E0B",
                                           
                                          ]}
                                          borderColor={[
                                            "#14B8A6",
                                            "#FACC15",
                                            "#F59E0B",
                                            
                                          ]}

                                />
                                <div className="chartDataWrapper">
                                  {Object.entries(data?.cities || {}).map(([city, value], index) => (
                                    <ul key={city}>
                                      <li>
                                        <p>
                                          <span className={`${index === 0 ? 'orangeDot' : 'lightGreenDot'}`}></span>
                                          {city}
                                        </p>
                                      </li>
                                      <li>
                                        <p className="uk-text-bold">{value}</p>
                                      </li>
                                    </ul>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="uk-width-2-3">
                            <div
                              className="uk-grid uk-grid-small"
                              uk-grid=""
                              uk-height-match="target: > div > div"
                            >
                              <div className="uk-width-1-2">
                                <div className="cardbox">
                                  <div className="cardHeading ">
                                    <span>User Creation</span>
                                    <button
                                      type="button"
                                      className="view-all-link"
                                      onClick={() => navigate("/agent-list")}
                                    >
                                      View All
                                    </button>
                                  </div>
                                  <div className="user-creation-content">
                                    <div className="user-list">
                                      {data?.agents.map((agent) => (
                                        <div key={agent.user_id} className="user-item">
                                          <button type="button" className="user-avatar-btn">
                                            <img
                                              src={`https://i.pravatar.cc/300?img=${agent.user_id}`}
                                              alt=""
                                              className="user-avatar"
                                            />
                                          </button>
                                          <span className="user-name">{agent.name}</span>
                                        </div>
                                      ))}
                                      <div className="user-item">
                                        <button type="button" className="add-user-btn" onClick={()=> navigate("/add-user")}>
                                          <Add size={20} />
                                        </button>
                                        <span className="add-user-text">Add user</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="uk-width-1-2">
                                <div className="mainBox uk-margin-remove-bottom">
                                  <div className="boxHeading">
                                    <span>Top 5 Performing Call Agent</span>
                                  </div>
                                  <div className="boxCntent">
                                    <div className="simpleTable">
                                      <table>
                                        <thead>
                                          <tr>
                                            <th style={{ textAlign: "left" }}>
                                              Sales Agent
                                            </th>
                                            <th>Success Rating</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {data?.topAgents.map((agent) => (
                                            <tr key={agent.user_id}>
                                              <td className="agentName">{agent.name}</td>
                                              <td>{agent.success_rate}%</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="uk-width-1-1">
                                <div className="mainBox">
                                  <div className="boxHeading">
                                    <span>Real Time Monitoring</span>
                                  </div>
                                  <div className="boxContent">
                                    <div className="uk-grid" uk-grid="">
                                      <div className="uk-width-1-4 uk-first-column">
                                        <div className="txtwrp">
                                          <h2>{data?.realtimeData?.active_calls}</h2>
                                          <span className="status completed">Active Calls</span>
                                        </div>
                                      </div>
                                      <div className="uk-width-1-4">
                                        <div className="txtwrp">
                                          <h2>{data?.realtimeData?.pending_calls}</h2>
                                          <span className="status pending">Pending Calls</span>
                                        </div>
                                      </div>
                                      <div className="uk-width-1-4">
                                        <div className="txtwrp">
                                          <h2>{data?.realtimeData?.active_agents}</h2>
                                          <span className="status completed">Active Agent</span>
                                        </div>
                                      </div>
                                      <div className="uk-width-1-4">
                                        <div className="txtwrp">
                                          <h2>{data?.realtimeData?.inactive_agents}</h2>
                                          <span className="status danger">Unactive Agent</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="userTableWrp">

                          <div className="uk-flex uk-flex-between" >
                        <h2>Agent List</h2>
                        <a className="viewAll" href="/All-Agents-List">See all</a>

                          </div>
                          <table className="uk-table">
                            <thead>
                              <tr>
                                <th>S.NO</th>
                                <th>AGENT ID</th>
                                <th>AGENT NAME</th>
                                <th>STATUS</th>
                                <th>LAST ACTIVE TIME</th>
                                <th>NO OF CALLS COMPLETED</th>
                                <th>NO OF PENDING CALLS</th>
                                <th>LIST OF SURVEY</th>
                                <th>SURVEY SUCCESS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.agents_list.slice(0, 4).map((agent, index) => (
                                <tr key={agent.user_id}>
                                  <td>{index + 1}</td>
                                  <td className="uk-text-bold">{agent.user_id}</td>
                                  <td>{agent.agent_name}</td>
                                  <td>
                                    <span className={`status ${agent.status === 1 ? 'completed' : 'pending'}`}>
                                      {agent.status === 1 ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td>{agent.last_login_at || 'Never'}</td>
                                  <td>{agent.calls_completed}</td>
                                  <td>{agent.pending_calls}</td>
                                  <td>{agent.list_of_survey}</td>
                                  <td>{agent.survey_success || '0%'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* {data?.length > 0 && (
                            <div>
                              <div className="paginationcard uk-card uk-card-default uk-margin-remove-top">
                                <ReactPaginate
                                  previousLabel={"←"}
                                  nextLabel={"→"}
                                  breakLabel={"..."}
                                  breakClassName={"break-me"}
                                  pageCount={Math.ceil(
                                    Paginationdata?.total_records / PageSize
                                  )}
                                  marginPagesDisplayed={1}
                                  pageRangeDisplayed={2}
                                  onPageChange={(e) =>
                                    setCurrentPage(e.selected + 1)
                                  }
                                  containerClassName={"pagination"}
                                  activeClassName={"active"}
                                  forcePage={currentPage - 1}
                                  disableInitialCallback={true}
                                  disabled={isLoading}
                                />
                              </div>
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
