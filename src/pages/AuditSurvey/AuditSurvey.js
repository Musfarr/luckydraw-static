import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../Utils/apiServices";
import DataTable1 from "../../reusables/components/DataTable1/DataTable1";
import DataTable2 from "../../reusables/components/DataTable2/DataTable2";
import angryImg from "../../assets/images/icons/angry-color.svg";
import happyImg from "../../assets/images/icons/happy-color.svg";
import { Calendar, ChevronDown, ChevronLeft, Download } from "@carbon/icons-react";
import Spinner from "../../reusables/Spinner";



const AuditSurvey = () => {
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Paginationdata, setPaginationData] = useState(null);
  // set row record
  const [row, setRow] = useState(null);
  const [selectedtab, setSelectedtab] = useState('pending');

  const navigate = useNavigate();





  // Static data for DataTable2
  const staticTable2Data = [
    {
      id: 1,
      phone_no: "03335249073",
      name: "Mudassir Ahmed",
      city_location: "Karachi, Pakistan",
      created_at: "2025-02-20 14:17:34",
      status: "completed",
      duration: "00:15:30",
      product_you_purchase: "Lifebuoy Soap",
      product_experience: angryImg,
      message: "The product quality is very good and I'm satisfied with it.",
    },
    {
      id: 2,
      phone_no: "03335249074",
      name: "Ali Khan",
      city_location: "Lahore, Pakistan",
      created_at: "2025-02-20 14:18:34",
      status: "completed",
      duration: "00:12:45",
      product_you_purchase: "Surf Excel",
      product_experience: happyImg,
      message: "Works well but price is a bit high.",
    },
  ];

  const paginationData2 = {
    total_records: staticTable2Data.length,
  };

  const getSurvey = () => {
    setIsLoading(true);
    const onSuccess = (response) => {
      setData(response.data);
      // setPaginationData(response?.pagination);
      setIsLoading(false);
    };



    const onFailure = (error) => {
      setData([]);
      setIsLoading(false);
    };
    let params = {
      per_page: 10,
      // limit: PageSize,
      type: selectedtab
    };
    apiGet(`agent/dashboard`, onSuccess, onFailure, undefined, params);
  };

  useEffect(() => {
    getSurvey();
  }, [currentPage ,selectedtab]);





  return (
    <div className="userWrp">
      <div className="userTabContent">
        <div className="uk-container uk-container-large">
          <div className="backbtn">
            <button type="button" onClick={() => navigate(-1)}>
              <ChevronLeft /> Back
            </button>
          </div>
          <div uk-grid="" className="uk-grid uk-margin-top uk-flex-middle">
            <div className="uk-width-1-2">
              <div className="campaignHeading">
                <p>AUDIT SURVEY CALLS</p>
              </div>
            </div>
            <div className="uk-width-1-2 btnSection">
              <button className="exportBtn">
                <Download /> Export Data
              </button>

              <div className="uk-inline">
                <button className="calenderBtn rangeBtn">
                  <Calendar /> Last 30 days{" "}
                  <span className="uk-inline">
                    <ChevronDown />
                  </span>
                </button>
                <div uk-dropdown="mode: click" className="calendarDropdown">
                  <div className="dropDownHeading">
                    <span>Select a range</span>
                  </div>
                  <ul>
                    <li className="active">
                      <button type="button" className="rangeBtn">
                        <span className="rangeBtnCircle"></span> Last 30 days
                      </button>
                    </li>
                    <li>
                      <button type="button" className="rangeBtn">
                        <span className="rangeBtnCircle"></span> This week
                      </button>
                    </li>
                    <li>
                      <button type="button" className="rangeBtn">
                        <span className="rangeBtnCircle"></span> Last week
                      </button>
                    </li>
                    <li>
                      <button type="button" className="rangeBtn">
                        <span className="rangeBtnCircle"></span> This month
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="analyticsContainer formCentralContainer">
            <ul
              className="uk-subnav uk-subnav-pill  OrdersTabs "
              uk-switcher="connect: #analyticsTabs"
            >
              <li>
                <a onClick={() => setSelectedtab('pending')}>Pending Calls </a>
              </li>
              <li>
                <a onClick={() => setSelectedtab('completed')}>Completed Calls </a>
              </li>
            </ul>
            <div className="tabContent">
              <ul className="uk-switcher uk-margin" id="analyticsTabs">
                <li>
                  <DataTable1
                  data={data?.calls?.data}
                  isLoading={isLoading}
                  currentPage={currentPage2}
                  setCurrentPage={setCurrentPage2}
                  PageSize={PageSize}
                  Paginationdata={paginationData2}
                  />
                </li>
                <li>
                  <DataTable2
                    data={data?.calls?.data}
                    isLoading={isLoading}
                    currentPage={currentPage2}
                    setCurrentPage={setCurrentPage2}
                    PageSize={PageSize}
                    Paginationdata={paginationData2}
                  />
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
