import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPost } from "../../Utils/apiServices";
import { debounce, set } from "lodash";
import Pagination from "../../components/Pagination/Pagination";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import DataTable1 from "../../reusables/components/DataTable1/DataTable1";
import DataTable2 from "../../reusables/components/DataTable2/DataTable2";



const AuditSurvey = () => {
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
                <p>AUDIT SURVEY CALLS</p>
              </div>
            </div>
          </div>

          <div className="analyticsContainer formCentralContainer">
                    <ul
                      className="uk-subnav uk-subnav-pill  OrdersTabs "
                      uk-switcher="connect: #analyticsTabs"
                    >
                    
                      <li>
                        <a>Pending Calls </a>
                      </li>
                      <li>
                        <a>Completed Calls </a>
                      </li>

                    
                    </ul>
                    <div className="tabContent">
                      <ul className="uk-switcher uk-margin" id="analyticsTabs">
                        <li>
                          <DataTable1/>
                        </li>
                        <li>
                          <DataTable2/>
                        </li>
                        
                      </ul>
                    </div>
                  </div>

          
      </div>
      </div>
    </div>
  );
};

export default AuditSurvey;
