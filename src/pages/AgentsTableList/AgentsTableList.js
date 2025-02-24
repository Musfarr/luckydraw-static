import React, { useEffect, useState } from 'react';
import { apiGet } from '../../Utils/apiServices';
import ReactPaginate from 'react-paginate';
import Spinner from '../../reusables/Spinner';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from '@carbon/icons-react';

const AgentsTableList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 10;

  const fetchAgents = () => {
    setIsLoading(true);
    const onSuccess = (response) => {
      setData(response.data.agents);
      setIsLoading(false);
    };

    const onFailure = (error) => {
      console.error("Failed to fetch agents:", error);
      setIsLoading(false);
    };

    apiGet('/get-agent-list', onSuccess, onFailure , undefined , {per_page:10});
  };

  useEffect(() => {
    fetchAgents();
  }, [currentPage]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="boradcastWrp">
      <div className="broadcastContentWrp">
        <div className="overviewContent">
          <div className="uk-container uk-container-large">
          <div className="backbtn">
            <button type="button" onClick={() => navigate(-1)}>
              <ChevronLeft /> Back
            </button>
          </div>
            <div className="uk-grid uk-flex-middle" uk-grid="">
              <div className="uk-width-1-1 uk-margin-remove-top">
                <div
                  className="analyticsWhatsappContent"
                  style={{ marginTop: "16px" }}
                >
                  <div className="uk-grid uk-flex-middle" uk-grid="">
                    <div className="uk-width-1-1 uk-margin-remove">
                      <div className="overviewMainContent">
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
                              {data?.data.map((agent, index) => (
                                <tr key={agent.user_id}>
                                  <td>{index + 1}</td>
                                  <td className="uk-text-bold">
                                    {agent.user_id}
                                  </td>
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

                          {data?.data?.length > 0 && (
                            <div>
                              <div className="paginationcard uk-card uk-card-default uk-margin-remove-top">
                                <ReactPaginate
                                  previousLabel={"←"}
                                  nextLabel={"→"}
                                  breakLabel={"..."}
                                  breakClassName={"break-me"}
                                  pageCount={Math.ceil(data.total / PageSize)}
                                  marginPagesDisplayed={1}
                                  pageRangeDisplayed={2}
                                  onPageChange={(e) => setCurrentPage(e.selected + 1)}
                                  containerClassName={"pagination"}
                                  activeClassName={"active"}
                                  forcePage={currentPage - 1}
                                  disableInitialCallback={true}
                                  disabled={isLoading}
                                />
                              </div>
                            </div>
                          )}
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

export default AgentsTableList;