import { Calendar, ChevronLeft } from "@carbon/icons-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { Link } from "react-router-dom";
import LineChart from "../../components/Graph/LineChart";
import { apiPost } from "../../Utils/apiServices";

const Units = () => {
  const [datefrom, setStartDate] = useState(null);
  const [dateto, setEndDate] = useState(null);
  const [category, setCategory] = useState("");
  const [loader, setLoader] = useState(false);
  const [TOTAL_UNITS, setTotalUnits] = useState(0);
  const [graphData, setGraphData] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const onSuccess = (response) => {
    setLoader(false);
    if (response.code === 200) {
      setTotalUnits(response.data.total_units || 0);
      setGraphData(response.data || null);
      toast.success("Stats fetched successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  const onFailure = (error) => {
    toast.warning(error?.response?.data?.message, {
      position: toast.POSITION.TOP_RIGHT,
    });
    setLoader(false);
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (datefrom && dateto) {
      setLoader(true);
      const payload = {
        datefrom: moment(datefrom).format("YYYY-MM-DD"),
        dateto: moment(dateto).format("YYYY-MM-DD"),
        type:category
      };

      apiPost('/units-stats', onSuccess, onFailure, payload);
    } else {
      toast.error("Please select both dates", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setCategory("");
    setTotalUnits(0);
    setGraphData(null);
  };

  return (
    <div className="addTeamWrp">
      <div className="uk-container uk-container-large">
        <div className="backBtn">
          <Link to="/dashboard">
            <ChevronLeft /> Back
          </Link>
        </div>
        <div className="addTeamHeading">
          <h3>Units</h3>
        </div>

        <div className="addTeamBox">
          <div className="formwrp">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="uk-grid uk-grid-small" uk-grid="">
                <div className="uk-width-1-2">
                  <div className="formInput dateTimePicker">
                    <label>Start Date</label>
                    <Datetime
                      value={datefrom}
                      onChange={handleStartDateChange}
                      dateFormat="YYYY-MM-DD"
                      timeFormat={false}
                      inputProps={{ placeholder: "Select a date..." }}
                    />
                    <Calendar />
                  </div>
                </div>
                
                <div className="uk-width-1-2">
                  <div className="formInput dateTimePicker">
                    <label>End Date</label>
                    <Datetime
                      value={dateto}
                      onChange={handleEndDateChange}
                      dateFormat="YYYY-MM-DD"
                      timeFormat={false}
                      inputProps={{ placeholder: "Select a date..." }}
                    />
                    <Calendar />
                  </div>
                </div>

                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label>Category</label>
                    <select
                      className="uk-select"
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="1">Yumnaz Perfume</option>
                    </select>
                  </div>
                </div>

                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label>Total Units</label>
                    <div className="addTeamHeading">
                      <h3>{TOTAL_UNITS}</h3>
                    </div>
                  </div>
                </div>

                <div className="adminRoleWrp uk-margin-remove">
                  <div className="btnwrp">
                    <button className="btn-1 w-90" type="button" onClick={handleReset}>
                      Reset
                    </button>

                    <button className="btn-2 w-90" type="submit">
                      {loader ? (
                        <div uk-spinner="" className="loader"></div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        
          <div className="addTeamBox">
            <div 
              className="boxContent" 
              style={{ 
                height: "400px",
                width: "100%",
              }}
            > 
              
                <LineChart 
                  Title={'Call Responses & Units'} 
                  dataValues={graphData?.chartdata || ''}
                  label={graphData?.dateLabels || []}
                />
              
            </div>
          </div>
      </div>
    </div>
  );
};

export default Units;