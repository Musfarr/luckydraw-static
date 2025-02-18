import { Calendar } from "@carbon/icons-react";
import React from "react";
import { useState } from "react";
import { apiPost } from "../../Utils/apiServices";
import { toast } from "react-toastify";
import excel from "../../assets/images/excel.webp";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { useAuth } from "../../Context/AuthProvider";
import campaignFile from "../../assets/file/callvex_sample_file.csv";
const CreateCampaign = () => {
  const { auth } = useAuth();
  const [errorEnable, setErrorEnable] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [loader, setLoader] = useState(false);
  const [resultData, setResultData] = useState();
  const [submittedData, setSubmittedData] = useState({
    campaignName: "",
    campaignStartDate: "",
    callType: "",
    campaignNumber: "",
    csvFile: "",
    userId: auth.user.id,
  });
  const addUser = (e) => {
    e.preventDefault();
    setErrorEnable(true);
    setResultData(undefined)
    setLoader(true);

    var formData = new FormData();
    formData.append("campaign_name", submittedData.campaignName);
    formData.append("campaign_start_date", submittedData.campaignStartDate);
    formData.append("call_type", submittedData.callType);
    formData.append("campaign_number", submittedData.campaignNumber);
    formData.append("csv_file", submittedData.csvFile);
    formData.append("user_id", submittedData.userId);

    if (
      submittedData.campaignName !== "" &&
      submittedData.campaignStartDate !== "" &&
      submittedData.callType !== "" &&
      submittedData.campaignNumber !== "" &&
      submittedData.csvFile !== ""
    ) {
      apiPost(`/campaign/create`, onSuccess, onFailure, formData);
    } else {
      setLoader(false);
    }
  };
  const onSuccess = (response) => {
    if (response.code === 200) {
      setTimeout(() => {
        setLoader(false);
        toast.success("Camapign created successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });

        //empty form fields
        setCurrentDateTime(null);
        setSubmittedData({
          campaignName: "",
          campaignStartDate: "",
          callType: "",
          campaignNumber: "",
          csvFile: "",
          userId: auth.user.id,
        });

        setErrorEnable(false);
        setResultData(response.data);
      }, 1000);
    }
  };
  const onFailure = (error) => {
    if (error?.response?.data?.message) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setLoader(false);
  };
  const handleDateChange = (date) => {
    // Merge the selected date with the current time
    const currentTime = moment();
    const selectedDateWithTime = moment(date)
      .set("hour", currentTime.hour())
      .set("minute", currentTime.minute())
      .set("second", currentTime.second());

    // Update states
    setCurrentDateTime(selectedDateWithTime);
    setSubmittedData({
      ...submittedData,
      campaignStartDate: selectedDateWithTime.format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setSubmittedData({ ...submittedData, csvFile: file });
  };
  return (
    <div className="addTeamWrp">
      <div className="uk-container uk-container-large">
        <div className="backBtn">
          {/* <Link to="/campaign">
            <ChevronLeft /> Back
          </Link> */}
        </div>
        <div className="addTeamHeading">
          <h3>Launch Campaign</h3>
        </div>
        <div className="addTeamBox">
          <div className="formwrp">
            <form onSubmit={addUser} autoComplete="off">
              <div className="uk-grid uk-grid-small" uk-grid="">
                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label htmlFor="f_name">Campaign Name</label>
                    <input
                      type="text"
                      placeholder="Please enter campaign name"
                      className="uk-input"
                      value={submittedData.campaignName}
                      onChange={(e) => {
                        setSubmittedData({
                          ...submittedData,
                          campaignName: e.target.value,
                        });
                      }}
                    />

                    {submittedData.campaignName === "" && errorEnable && (
                      <div className="formErrors">
                        Campaign name is required
                      </div>
                    )}
                  </div>
                </div>
                <div className="uk-width-1-2">
                  <div className="formInput dateTimePicker">
                    <label htmlFor="">Campaign Start Date</label>
                    <Datetime
                      value={currentDateTime} // Show nothing by default, updated after selection
                      onChange={handleDateChange}
                      dateFormat="YYYY-MM-DD"
                      timeFormat="HH:mm:ss"
                      inputProps={{ placeholder: "Select a date..." }}
                    />
                    <Calendar />
                    {submittedData.campaignStartDate === "" && errorEnable && (
                      <div className="formErrors">
                        Campaign date time is required
                      </div>
                    )}
                  </div>
                </div>
                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label htmlFor="">Select Call Type</label>
                    <select
                      name=""
                      className="uk-select"
                      onChange={(e) => {
                        setSubmittedData({
                          ...submittedData,
                          callType: e.target.value,
                        });
                      }}
                      value={submittedData.callType}
                    >
                      <option value="" disabled selected>
                        Select a call type
                      </option>
                      <option value="1">Unilever</option>
                      
                    </select>
                    {submittedData.callType === "" && errorEnable && (
                      <div className="formErrors">Call type is required</div>
                    )}
                  </div>
                </div>
                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label htmlFor="">Campaign Number</label>
                    {/* <input
                      type="text"
                      placeholder="Please enter campaign number"
                      className="uk-input"
                      value={submittedData.campaignNumber}
                      onChange={(e) => {
                        setSubmittedData({
                          ...submittedData,
                          campaignNumber: e.target.value,
                        });
                      }}
                    /> */}
                    <select
                      name=""
                      className="uk-select"
                      onChange={(e) => {
                        setSubmittedData({
                          ...submittedData,
                          campaignNumber: e.target.value,
                        });
                      }}
                      value={submittedData.campaignNumber}
                    >
                      <option value="" disabled selected>
                        Select a number
                      </option>
                      <option value="3497772340">3497772340</option>
                    </select>
                    {submittedData.campaignNumber === "" && errorEnable && (
                      <div className="formErrors">Number is required</div>
                    )}
                  </div>
                </div>
                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label htmlFor="">Upload Numbers (.CSV File Only)</label>
                    <div className="js-upload uk-placeholder uk-text-center uk-margin-remove">
                      <span uk-icon="icon: cloud-upload"></span>
                      <div uk-form-custom="">
                        <input
                          type="file"
                          aria-label="Custom controls"
                          style={{ width: "100%" }}
                          accept={".csv"}
                          onChange={(e) => handleFile(e)}
                        />
                        <span className="uk-link">&nbsp; Upload file</span>
                        {/* end new work  */}
                      </div>
                    </div>
                    {submittedData?.csvFile && (
                      <div>{submittedData.csvFile.name}</div>
                    )}
                    {submittedData.csvFile === "" && errorEnable && (
                      <div className="formErrors">Csv file is required</div>
                    )}
                  </div>
                </div>
                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label htmlFor="">Download Sample Format</label>
                    <div>
                      <a href={campaignFile} download="import-contact">
                        <img
                          src={excel}
                          style={{ width: "75px", cursor: "pointer" }}
                        />
                      </a>
                    </div>
                  </div>
                </div>
                {resultData && (
                  <div className="uk-width-1-1">
                    <div className="campaignListResult">
                      <p>
                        Total Uploaded Numbers:{" "}
                        <span> {resultData?.total_uploaded_numbers}</span>
                      </p>
                      <p>
                        Total Accepted Numbers:{" "}
                        <span> {resultData?.total_accepted_numbers}</span>
                      </p>
                    </div>
                  </div>
                )}
                <div className="adminRoleWrp uk-margin-remove">
                  <div className="btnwrp">
                    <button className="btn-2 w-80" type="submit">
                      {loader ? (
                        <div uk-spinner="" className="loader"></div>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
