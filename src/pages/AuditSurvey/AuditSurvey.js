import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  const [row, setRow] = useState(null);
  const [selectedtab, setSelectedtab] = useState('pending');
  const [selectedRange, setSelectedRange] = useState('last_30_days');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  /**
   * Calculate date range based on selected option
   * @param {string} range - Selected date range option
   * @returns {Object} Date range object with from and to dates
   */
  const calculateDateRange = (range) => {
    const today = new Date();
    const from = new Date();
    const to = new Date(today);

    switch (range) {
      case 'this_week':
        from.setDate(today.getDate() - today.getDay()); // Start of current week
        break;
      case 'last_week':
        from.setDate(today.getDate() - today.getDay() - 7); // Start of last week
        to.setDate(today.getDate() - today.getDay() - 1); // End of last week
        break;
      case 'this_month':
        from.setDate(1); // Start of current month
        break;
      case 'last_30_days':
      default:
        from.setDate(today.getDate() - 30);
        break;
    }

    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    };
  };

  /**
   * Handle date range selection
   * @param {string} range - Selected date range
   */
  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    const dates = calculateDateRange(range);
    setDateRange(dates);
  };

  /**
   * Get surveys with optional date range
   */
  const getSurvey = () => {
    setIsLoading(true);
    const params = {
      per_page: PageSize,
      status: selectedtab,
      ...(dateRange.from && dateRange.to && {
        date_from: dateRange.from,
        date_to: dateRange.to
      })
    };

    const onSuccess = (response) => {
      setData(response.data);
      setPaginationData(response.meta);
      setIsLoading(false);
    };

    const onFailure = (error) => {
      console.error("Error fetching surveys:", error);
      setIsLoading(false);
    };

    apiGet("/agent/dashboard", onSuccess, onFailure, null , params);
  };

  /**
   * Export survey data as CSV
   */
  const handleExport = () => {
    setIsLoading(true);
    const params = {
      status: selectedtab,
      download: 'csv',
      ...(dateRange.from && dateRange.to && {
        date_from: dateRange.from,
        date_to: dateRange.to
      })
    };

    const onSuccess = (response) => {
      setIsLoading(false);
      // Create a temporary link and click it to download the file
      const link = document.createElement('a');
      link.href = response.file_path;
      link.setAttribute('download', 'survey_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const onFailure = (error) => {
      console.error("Error exporting data:", error);
      setIsLoading(false);
    };

    apiPost("/agent/dashboard", onSuccess, onFailure, params);
  };

  useEffect(() => {
    getSurvey();
  }, [currentPage, selectedtab, dateRange]);

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

  return (
    <div className="userWrp">
      <div className="userTabContent">
        <div className="uk-container uk-container-large">
          <div className="backbtn">
            <button type="button">
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
              <button className="exportBtn" onClick={handleExport}>
                <Download /> Export Data
              </button>

              <div className="uk-inline">
                <button className="calenderBtn rangeBtn">
                  <Calendar /> {selectedRange.replace(/_/g, ' ')} {" "}
                  <span className="uk-inline">
                    <ChevronDown />
                  </span>
                </button>
                <div uk-dropdown="mode: click" className="calendarDropdown">
                  <div className="dropDownHeading">
                    <span>Select a range</span>
                  </div>
                  <ul>
                    <li className={selectedRange === 'last_30_days' ? 'active' : ''}>
                      <button 
                        type="button" 
                        className="rangeBtn"
                        onClick={() => handleRangeSelect('last_30_days')}
                      >
                        <span className="rangeBtnCircle"></span> Last 30 days
                      </button>
                    </li>
                    <li className={selectedRange === 'this_week' ? 'active' : ''}>
                      <button 
                        type="button" 
                        className="rangeBtn"
                        onClick={() => handleRangeSelect('this_week')}
                      >
                        <span className="rangeBtnCircle"></span> This week
                      </button>
                    </li>
                    <li className={selectedRange === 'last_week' ? 'active' : ''}>
                      <button 
                        type="button" 
                        className="rangeBtn"
                        onClick={() => handleRangeSelect('last_week')}
                      >
                        <span className="rangeBtnCircle"></span> Last week
                      </button>
                    </li>
                    <li className={selectedRange === 'this_month' ? 'active' : ''}>
                      <button 
                        type="button" 
                        className="rangeBtn"
                        onClick={() => handleRangeSelect('this_month')}
                      >
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
