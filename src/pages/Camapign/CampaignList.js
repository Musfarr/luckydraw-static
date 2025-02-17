import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPost } from "../../Utils/apiServices";
import { debounce, set } from "lodash";
import Pagination from "../../components/Pagination/Pagination";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

const CampaignList = () => {
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Paginationdata, setPaginationData] = useState(null);
  // set row record
  const [row, setRow] = useState(null);

  const getCampaigns = () => {
    setIsLoading(true);
    const onSuccess = (response) => {
      setData(response.data);
      setPaginationData(response?.pagination);
      setIsLoading(false);
    };
    const onFailure = (error) => {
      setData([])
      setIsLoading(false);
    };
    let params = { 
      page: currentPage,
      limit: PageSize,
    };
    apiGet(`/campaign/list`, onSuccess, onFailure, undefined, params);
  };

  useEffect(() => {
    getCampaigns();
  }, [currentPage]);

  const onChange = (e) => {
    setData(null);
    var searchedValue = e.target.value;

    if (searchedValue !== "") {
      apiGet(
        `/agent/search/${searchedValue}`,
        onSuccessSearch,
        onFailureSearch
      );
    } else {
      getCampaigns();
    }
  };
  const debouncedOnChange = debounce(onChange, 1000);

  const onSuccessSearch = (response) => {
    if (response.status === 0) {
      // setCurrentPage(1)
      setData(response?.data);
    }
  };
  const onFailureSearch = (error) => {
    console.log(error);
  };

  const currentTableData = useMemo(() => {
    return data || [];
  }, [data]);

  const cancelCamapign = (id) => {
    const onSuccess = (response) => {
      // Update only the specific row's campaign_status
      setData((prevData) =>
        prevData.map((item) =>
          item.campaign_id === id ? { ...item, campaign_status: 5 } : item
        )
      );

      setTimeout(() => {
        toast.success("Camapign cancelled successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 700);
        setRow(null);
      }, 1000);
    };
    const onFailure = (error) => {
      console.log(error);
      setRow(null);
    };
    apiPost("/campaign/cancel", onSuccess, onFailure, { campaign_id: id });
  };

  return (
    <div className="userWrp">
      <div className="userTabContent">
        <div className="uk-container uk-container-large">
          <div uk-grid="" className="uk-margin-top">
            <div className="uk-width-1-2">
              <div className="campaignHeading">
                <p>CAMPAIGN LIST</p>
              </div>
            </div>
            {/* <div className="uk-width-1-2">
              <div className="searchField">
                <form action="">
                  <input
                    type="text"
                    placeholder="Search by contact number"
                    onChange={(e) => {
                      //   setSearchInput(e.target.value);
                      //   debouncedHandleSearch();
                    }}
                    // onKeyPress={handleKeyPress}
                  />
                </form>
              </div>
            </div> */}
          </div>
          <div className="userTableWrp">
            <table className="uk-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER NAME</th>
                  <th>CAMPAIGN NAME</th>
                  <th>FILES UPLOADED</th>
                  <th>DATE</th>
                  <th>ACCEPTED NUMBERS</th>
                  <th>REPORT</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && data?.length > 0 && (
                  <tr>
                    <td colSpan={8} style={{ position: 'relative', height: '200px' }}>
                      <div style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '20px',
                        borderRadius: '5px',
                        zIndex: 1000
                      }}>
                        <div uk-spinner=""></div>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && data?.length > 0 ? (
                  data?.map((val, index) => (
                    <tr key={val.campaign_id}>
                      <td>{index + 1 + (currentPage - 1) * PageSize}</td>
                      <td>{val.user.username}</td>
                      <td className="agnetName">
                        <Link>{val?.campaign_name}</Link>
                      </td>
                      <td>{val?.csv_file_path}</td>
                      <td>{val?.campaign_execution_date}</td>
                      <td>{val.total_accepted_numbers}</td>
                      <td>
                        {/* Campaign cancelled */}
                        {val.campaign_status === 5 && (
                          <button
                            className="btn-pending"
                            type="button"
                            disabled
                          >
                            Cancelled
                          </button>
                        )}

                        {/* Scheduled state */}
                        {val.campaign_status === 1 && (
                          <>
                            <Link>
                              <span className="available greenColor">
                                Scheduled
                              </span>
                            </Link>
                            <button
                              className="btn-pending"
                              type="button"
                              onClick={() => {
                                setRow(val);
                                cancelCamapign(val.campaign_id, index);
                              }}
                            >
                              {row?.campaign_id === val.campaign_id ? (
                                <div uk-spinner="ratio: 0.5"></div>
                              ) : (
                                "Cancel"
                              )}
                            </button>
                          </>
                        )}

                        {/* Already executed */}
                        {val.campaign_status === 4 && (
                          <Link to={`/campaign-report/${val.campaign_id}`}>
                            <span className="available greenColor">Report</span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="dataNotFound">
                      {data === null ? (
                        <div uk-spinner=""></div>
                      ) : (
                        " No data found "
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {data?.length > 0 && (
              <div>
                <div className="paginationcard uk-card uk-card-default uk-margin-remove-top">
                  <ReactPaginate
                    previousLabel={"←"}
                    nextLabel={"→"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={Math.ceil(Paginationdata?.total_records / PageSize)}
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
  );
};

export default CampaignList;
