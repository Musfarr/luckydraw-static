import React, { useState } from "react";
import {
  Hourglass,
  Phone,
  PhoneBlock,
  PhoneOutgoing,
} from "@carbon/icons-react";
import { useEffect } from "react";
import { apiGet } from "../../Utils/apiServices";
import DataTable1 from "../../reusables/components/DataTable1/DataTable1";
import Spinner from "../../reusables/Spinner";



const Dashboard = () => {
  const [data, setData] = useState({
    totalCalls: 1250,
    totalAnswers: 850,
    totalNoAnswers: 400,
    avgMonthlyAnswerCalls: 780
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 10;
  const [tableRow, setTableRow] = useState(null);
  const [numberGraphData, setNumberGraphData] = useState({
    label: [],
    count: [],
  });

  // Static data for DataTable1
  const staticTableData = [
    {
      call_id: "033352490736",
      customer_info: "Mudassir",
      city_location: "Surjani, Karachi",
      call_time: "16:54:12",
      call_status: "Active",
      call_duration: "00:15:30"
    },
    {
      call_id: "033352490736",
      customer_info: "Mudassir",
      city_location: "Surjani, Karachi",
      call_time: "16:54:11",
      call_status: "Pending",
      call_duration: "-"
    },
    {
      call_id: "033352490736",
      customer_info: "Mudassir",
      city_location: "Surjani, Karachi",
      call_time: "16:54:10",
      call_status: "Completed",
      call_duration: "00:15:30"
    },
    {
      call_id: "033352490736",
      customer_info: "Mudassir",
      city_location: "Surjani, Karachi",
      call_time: "16:54:09",
      call_status: "Active",
      call_duration: "00:15:30"
    }
  ];

  const handleCancelCampaign = (campaignId, index) => {
    console.log(`Cancelled campaign ${campaignId} at index ${index}`);
  };

  const paginationData = {
    total_records: staticTableData.length
  };

  const getCampaign = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 90000);

  };

  useEffect(() => {
    getCampaign();
  }, []);

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
                                    {data.totalAnswers}
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
                                    {data.totalNoAnswers}
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
                                    {data.avgMonthlyAnswerCalls}
                                  </h2>
                                  <span>Success Rate</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>                  
                      </div>



                      <DataTable1 
                        data={staticTableData}
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
