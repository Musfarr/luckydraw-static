import React, { useState, useEffect } from "react";
import {
  Hourglass,
  Phone,
  PhoneBlock,
  PhoneOutgoing,
} from "@carbon/icons-react";
import { apiGet } from "../../Utils/apiServices";
import DataTable1 from "../../reusables/components/DataTable1/DataTable1";
import Spinner from "../../reusables/Spinner";

const Dashboard = () => {
  const [data, setData] = useState({
    totalCalls: 0,
    totalPending: 0,
    totalDuration: "0 min 0s",
    successRate: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 10;
  const [tableRow, setTableRow] = useState(null);
  const [callData, setCallData] = useState([]);
  const [numberGraphData, setNumberGraphData] = useState({
    label: [],
    count: [],
  });


  const getCampaign = () => {
    setIsLoading(true);

    const onSuccess = (response) => {
      let data = response.data; 

      setData({
        totalCalls: data.total_calls,
        totalPending: data.total_pending,
        totalDuration: data.total_duration,
        successRate: data.success_rate
      });

      setCallData(data.calls.data);

      setIsLoading(false);
    };

    const onFailure = (error) => {
      console.log(error);
      setIsLoading(false);
    };

    apiGet('/agent/dashboard', onSuccess, onFailure);
  };

  useEffect(() => {
    getCampaign();
  }, []);

  const handleCancelCampaign = (campaignId, index) => {
    console.log(`Starting call ${campaignId} at index ${index}`);
  };

  const paginationData = {
    total_records: callData.length
  };

  return isLoading ? (
    <Spinner />
  ) : (
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
                      <p className="uk-margin-remove">Agent</p>
                    </div>

                    <div className="uk-width-1-1 uk-margin-remove">
                      <div className="overviewMainContent">
                        <div className="mainBox">
                          <div className="boxHeading">
                            <span>Agent Overview</span>
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
                                  <h2>
                                    {data.totalCalls}
                                  </h2>
                                  <span>Total Calls</span>
                                </div>
                              </div>
                              <div className="uk-width-1-4">
                                <div className="txtwrp">
                                  <PhoneOutgoing
                                    style={{
                                      fill: "#1F36C7",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2>
                                    {data.totalPending}
                                  </h2>
                                  <span>Total Pending Calls</span>
                                </div>
                              </div>
                              <div className="uk-width-1-4">
                                <div className="txtwrp">
                                  <PhoneBlock
                                    style={{
                                      fill: "#1F36C7",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2>
                                    {data.totalDuration}
                                  </h2>
                                  <span>Total Call duration</span>
                                </div>
                              </div>
                              <div className="uk-width-1-4">
                                <div className="txtwrp">
                                  <Hourglass
                                    style={{
                                      fill: "#1F36C7",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2>
                                    {data.successRate}%
                                  </h2>
                                  <span>Success Rate</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>                  
                      </div>



                      <DataTable1 
                        data={callData}
                        isLoading={isLoading}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        PageSize={PageSize}
                        Paginationdata={paginationData}
                        onCancelCampaign={handleCancelCampaign}
                      />                                   



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

export default Dashboard;
