import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, apiPost } from "../../Utils/apiServices";
import {
  ChevronLeft,
  Hashtag,
  Hourglass,
  Phone,
  PhoneIncoming,
  PhoneOff,
  Renew,
  Search,
  Add,
  TrashCan,
  Edit,
} from "@carbon/icons-react";
import { debounce } from "lodash";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const CampaignReport = () => {
  // let PageSize = 10;
  const [PageSize, setPageSize] = useState(10);
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [Paginationdata, setPaginationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [Retryloader, setRetryLoader] = useState(false);
  const [ExportLoader, setExportLoader] = useState(false);

  const getReport = () => {
    setIsLoading(true);
    let param = { page: currentPage, limit: PageSize };
    apiGet(`/campaign/report/${params.id}`, onSuccessUsers, onFailureUsers , undefined, param);
  };
  const onSuccessUsers = (response) => {
    setData(response?.data);
    setPaginationData(response?.pagination)
    setIsLoading(false);
  };
  const onFailureUsers = (error) => {
    console.log(error);
    setIsLoading(false);
  };

  useEffect(() => {
    getReport();
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
      getReport();
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
    return data?.details || [];
  }, [data]);



  // Helper Function to Download File For Export Button
  const handleFileDownload = (filePath) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.setAttribute('download', ''); // This will keep the original filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Retry Button Functionality

  const Retry = () => {
    setRetryLoader(true);
    const onSuccessRetry = (response) => {
      toast.success(response.message);
      setRetryLoader(false);
    };
    const onFailureRetry = (error) => {
      setRetryLoader(false);
      toast.error("Failed to retry campaign");
    };

    apiPost(`/campaign/retry/${params.id}`, onSuccessRetry, onFailureRetry);
  };



  // Export Button Functionality

  const Export = () => {
    setExportLoader(true);

    const onSuccessExport = (response) => {
      setExportLoader(false);
      console.log(response.data.file_path, "filepath");
      if (response.data.file_path) {
        handleFileDownload(response.data.file_path);
      }
    };
    const onFailureExport = (error) => {
      setExportLoader(false);
      toast.error("Failed to Export");
    };

    apiGet(`/campaign/report/${params.id}/download`, onSuccessExport, onFailureExport);
  };

  return (
    <div className="userWrp">
      <div className="userTabContent">
        <div className="uk-container uk-container-large">
          <div className="backBtnWrp">
            <div className="backBtn">
              <Link to="/list-campaign">
                <ChevronLeft /> Back
              </Link>
            </div>
          </div>
          <div uk-grid="" className="uk-margin-top">
            <div className="uk-width-1-1">
              <div className="campaignHeading uk-flex uk-flex-between">
                <div>
                  <p>REPORT</p>
                </div>

                <div className="campaign-action-buttons">
                  <button
                    className="campaign-retry-button"
                    disabled={Retryloader}
                    onClick={Retry}
                  >
                    {Retryloader ? (
                      <Renew className="loading-spinner" />
                    ) : (
                      "Retry"
                    )}
                  </button>

                  <button
                    className="campaign-export-button"
                    onClick={Export}
                    disabled={ExportLoader}
                  >
                    {ExportLoader ? (
                      <Renew className="loading-spinner" />
                    ) : (
                      "Export"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="reportMainBox">
            <div className="uk-grid-small" uk-grid="">
              <div className="uk-width-1-6 uk-first-column">
                <div className="txtwrp">
                  <PhoneIncoming style={{ fill: "#B9B9B9" }} />
                  <h2 className="uk-margin-remove">
                    {data === null ? (
                      <span uk-spinner=""></span>
                    ) : (
                      data?.totalAnswers
                    )}
                  </h2>
                  <p>Total Answered Numbers</p>
                </div>
              </div>
              <div className="uk-width-1-6">
                <div className="txtwrp">
                  <PhoneOff style={{ fill: "#B9B9B9" }} />
                  <h2 className="uk-margin-remove">
                    {" "}
                    {data === null ? (
                      <span uk-spinner=""></span>
                    ) : (
                      data?.totalNoAnswers
                    )}
                  </h2>
                  <p>Total No-Answered Numbers</p>
                </div>
              </div>
              <div className="uk-width-1-6">
                <div className="txtwrp">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g
                      id="Group_177281"
                      data-name="Group 177281"
                      transform="translate(-517 -227)"
                    >
                      <g id="timer" transform="translate(517 227)">
                        <rect
                          id="Rectangle_163374"
                          data-name="Rectangle 163374"
                          width="24"
                          height="24"
                          fill="none"
                        />
                      </g>
                      <path
                        id="Path_104174"
                        data-name="Path 104174"
                        d="M-7.869,0h3.9L-.1-6.425h.083L3.835,0H7.8L2.125-8.832l5.744-8.633H3.885L.133-11.156H.05l-3.8-6.309H-7.786l5.694,8.749Z"
                        transform="translate(529 248)"
                        fill="#b9b9b9"
                      />
                    </g>
                  </svg>
                  <h2 className="uk-margin-remove">
                    {" "}
                    {data === null ? (
                      <span uk-spinner=""></span>
                    ) : (
                      data?.totalBusy
                    )}
                  </h2>
                  <p>Total Busy Numbers</p>
                </div>
              </div>
              <div className="uk-width-1-6">
                <div className="txtwrp">
                  <Hashtag style={{ fill: "#B9B9B9" }} />
                  <h2 className="uk-margin-remove">
                    {" "}
                    {data === null ? (
                      <span uk-spinner=""></span>
                    ) : (
                      data?.totalCongestion
                    )}
                  </h2>
                  <p>Total Congestion Numbers</p>
                </div>
              </div>
              <div className="uk-width-1-6">
                <div className="txtwrp">
                  <Phone style={{ fill: "#A8200D" }} />
                  <h2 className="uk-margin-remove">
                    {" "}
                    {data === null ? (
                      <span uk-spinner=""></span>
                    ) : (
                      data?.totalHangup
                    )}
                  </h2>
                  <p>Total Hangup Numbers</p>
                </div>
              </div>
              <div className="uk-width-1-6">
                <div className="txtwrp">
                  <Hourglass style={{ fill: "#B9B9B9" }} />
                  <h2 className="uk-margin-remove">
                    {" "}
                    {data === null ? (
                      <span uk-spinner=""></span>
                    ) : (
                      data?.totalDTMF
                    )}
                  </h2>
                  <p>Total DTMF</p>
                </div>
              </div>
            </div>
          </div>

          <div className="userTableWrp">
            <table className="uk-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CAMPAIGN NAME</th>
                  <th>CALLER NUMBER</th>
                  <th>RETRY COUNT</th>
                  <th>RESPONSE</th>
                  <th>Question1</th>
                  <th>Question2</th>
                  <th>Question3</th>
                  {/* <th>NUMBER</th> */}
                  <th>START DATE</th>
                  <th>START TIME</th>
                  <th>END DATE</th>
                  <th>END TIME</th>
                  <th>CALL SECONDS</th>
                  <th>CALL UNITS</th>
                  <th>RECORDING</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && data?.details?.length > 0 && (
                  <tr>
                    <td colSpan={19} style={{ position: 'relative', height: '200px' }}>
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
                {!isLoading && data?.details?.length > 0 ? (
                  currentTableData?.map((val, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1 + (currentPage - 1) * 10}</td>
                        <td>{val.campaign_name}</td>
                        <td className="agnetName">
                          <Link>
                            {val?.caller_number}
                          </Link>
                        </td>
                        <td className="textCapatalize">{val.retry_count}</td>
                        <td>{val.response === "" ? "-" : val.response}</td>
                        <td>{val.question1}</td>
                        <td>{val.question2}</td>
                        <td>{val.question3}</td>
                        {/* <td>{val.number}</td> */}
                        <td>{val.start_date}</td>
                        <td>{val.start_time}</td>
                        <td>{val.end_date}</td>
                        <td>{val.end_time}</td>
                        <td>{val.call_seconds}</td>
                        <td>{val.call_units}</td>
                        <td>
                          
                          <audio controls>
                            <source src={val.recording} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                          



                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={19} className="dtaNotFound">
                      {data === null ? (
                        <div uk-spinner=""></div>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {data?.details?.length > 0 && (
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

export default CampaignReport;
