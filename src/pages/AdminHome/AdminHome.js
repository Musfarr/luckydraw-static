import {
  Add,
  Phone,
  PhoneApplication,
  PhoneOff,
  UserServiceDesk,
} from "@carbon/icons-react";
import React from "react";
import PieChart from "../../components/Graph/PieChart";

const AdminHome = () => {
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
                      <h2 className="uk-margin-remove">Hi , User</h2>
                      <p className="uk-margin-remove">Unilever | Super Admin</p>
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
                                  <h2>3213</h2>
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
                                  <h2>31231</h2>
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
                                  <h2>32%</h2>
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
                                  <h2>55%</h2>
                                  <span>Success Rate</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="uk-grid uk-grid-small" uk-grid="">
                          <div className="uk-width-1-3">
                            <div className="mainBox">
                              <div className="boxHeading">
                                <span>Total Calls Summary</span>
                              </div>
                              <div className="boxContent">
                                <PieChart
                                  graphData={[1, 2, 3]}
                                  backgroundColor={[
                                    "#1f36c7",
                                    "#c71fc5",
                                    "#6ac71f",
                                  ]}
                                />
                                <div class="chartDataWrapper">
                                  <ul>
                                    <li>
                                      <p>
                                        <span class="orangeDot"></span>Islamabad
                                        (Capital city)
                                      </p>
                                    </li>
                                    <li>
                                      <p className="uk-text-bold">32%</p>
                                    </li>
                                  </ul>
                                  <ul>
                                    <li>
                                      <p>
                                        <span class="lightGreenDot"></span>
                                        Karachi (Largest city, port city)
                                      </p>
                                    </li>
                                    <li>
                                      <p className="uk-text-bold">0</p>
                                    </li>
                                  </ul>
                                  <ul>
                                    <li>
                                      <p>
                                        <span class="lightGreenDot"></span>
                                        Karachi (Largest city, port city)
                                      </p>
                                    </li>
                                    <li>
                                      <p className="uk-text-bold">0</p>
                                    </li>
                                  </ul>
                                  <ul>
                                    <li>
                                      <p>
                                        <span class="lightGreenDot"></span>
                                        Karachi (Largest city, port city)
                                      </p>
                                    </li>
                                    <li>
                                      <p className="uk-text-bold">0</p>
                                    </li>
                                  </ul>
                                  <ul>
                                    <li>
                                      <p>
                                        <span class="lightGreenDot"></span>
                                        Karachi (Largest city, port city)
                                      </p>
                                    </li>
                                    <li>
                                      <p className="uk-text-bold">0</p>
                                    </li>
                                  </ul>
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
                                    >
                                      View All
                                    </button>
                                  </div>
                                  <div className="user-creation-content">
                                    <div className="user-list">
                                      <div className="user-item">
                                        <button
                                          type="button"
                                          className="user-avatar-btn"
                                        >
                                          <img
                                            src="https://i.pravatar.cc/300?img=12"
                                            alt=""
                                            className="user-avatar"
                                          />
                                        </button>
                                        <span className="user-name">Talha</span>
                                      </div>
                                      <div className="user-item">
                                        <button
                                          type="button"
                                          className="add-user-btn"
                                        >
                                          <Add size={20} />
                                        </button>
                                        <span className="add-user-text">
                                          Add user
                                        </span>
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
                                          <tr>
                                            <td className="agentName">
                                              Mudassir
                                            </td>
                                            <td>60%</td>
                                          </tr>
                                          <tr>
                                            <td className="agentName">
                                              Mudassir
                                            </td>
                                            <td>60%</td>
                                          </tr>
                                          <tr>
                                            <td className="agentName">
                                              Mudassir
                                            </td>
                                            <td>60%</td>
                                          </tr>
                                          <tr>
                                            <td className="agentName">
                                              Mudassir
                                            </td>
                                            <td>60%</td>
                                          </tr>
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
                                          <h2>3213</h2>
                                          <span className="status completed">Active Calls</span>
                                        </div>
                                      </div>
                                      <div className="uk-width-1-4">
                                        <div className="txtwrp">
                                          <h2>31231</h2>
                                          <span className="status pending">Pending Calls</span>
                                        </div>
                                      </div>
                                      <div className="uk-width-1-4">
                                        <div className="txtwrp">
                                          <h2>32%</h2>
                                          <span className="status completed">Active Agent</span>
                                        </div>
                                      </div>
                                      <div className="uk-width-1-4">
                                        <div className="txtwrp">
                                          <h2>55%</h2>
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
                        <h2>Agent List</h2>
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
                                  <tr>
                                    <td>
                                    1
                                    </td>
                                    <td className="uk-text-bold">
                                    45645
                                    </td>
                                    <td>M.Mudassir</td>
                                    <td>
                                      <span className={`status completed`}>
                                        Active
                                      </span>
                                    </td>
                                    <td>16:54:12</td>
                                    <td>400</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td>60%</td>
                                  </tr>
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
