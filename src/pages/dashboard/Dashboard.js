import React, { useState } from "react";
import {
  Hourglass,
  Phone,
  PhoneBlock,
  PhoneOutgoing,
} from "@carbon/icons-react";
import DoughnutChart from "../../components/Graph/DoughnutChart";
import { useEffect } from "react";
import { apiGet } from "../../Utils/apiServices";
import PieChart from "../../components/Graph/PieChart";
import LineChart from "../../components/Graph/LineChart";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [numberGraphData, setNumberGraphData] = useState({
    label: [],
    count: [],
  });

  const getCampaign = () => {
    const onSuccess = (response) => {
      setData(response.data);

      let labels = [];
      response.data.numbers_details.map((item) => {
        labels.push(item.date);
      });

      let Count = [];
      response.data.numbers_details.map((item) => {
        Count.push(item.count);
      });

      setNumberGraphData({
        label: labels,
        count: Count,
      });
    };
    const onFailure = (error) => {
      console.log(error);
    };
    apiGet(`/campaign`, onSuccess, onFailure);
  };

  useEffect(() => {
    getCampaign();
  }, []);

  return (
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
                      <div className="pageHeading uk-margin-remove-bottom">
                        <h3>Dashboard Control Panel</h3>
                      </div>
                    </div>

                    <div className="uk-width-1-1 uk-margin-remove">
                      <div className="overviewMainContent">
                        <div className="mainBox">
                          <div className="boxHeading">
                            <span>Call Performance Summary</span>
                          </div>
                          <div className="boxContent">
                            <div className="uk-grid" uk-grid="">
                              <div className="uk-width-1-4 uk-first-column">
                                <div className="txtwrp">
                                  <Phone
                                    style={{
                                      fill: "#1ED760",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2 className="uk-margin-remove">
                                    {data === null ? (
                                      <span uk-spinner=""></span>
                                    ) : (
                                      data?.totalCalls
                                    )}
                                  </h2>
                                  <span>Total Calls</span>
                                </div>
                              </div>
                              <div className="uk-width-1-4">
                                <div className="txtwrp">
                                  <PhoneOutgoing
                                    style={{
                                      fill: "#1ED760",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2 className="uk-margin-remove">
                                    {data === null ? (
                                      <span uk-spinner=""></span>
                                    ) : (
                                      data?.totalAnswers
                                    )}
                                  </h2>
                                  <span>Delivered</span>
                                </div>
                              </div>
                              <div className="uk-width-1-4">
                                <div className="txtwrp">
                                  <PhoneBlock
                                    style={{
                                      fill: "#A8200D",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2 className="uk-margin-remove">
                                    {data === null ? (
                                      <span uk-spinner=""></span>
                                    ) : (
                                      data?.totalNoAnswers
                                    )}
                                  </h2>
                                  <span>Total UnAnswer Calls</span>
                                </div>
                              </div>
                              <div className="uk-width-1-4">
                                <div className="txtwrp">
                                  <Hourglass
                                    style={{
                                      fill: "#1ED760",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                  <h2 className="uk-margin-remove">
                                    {data === null ? (
                                      <span uk-spinner=""></span>
                                    ) : (
                                      data?.avgMonthlyAnswerCalls
                                    )}
                                  </h2>
                                  <span>AVG Answer Monthly</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="halfDonutSec halfDonutSize">
                          <div
                            className="uk-grid uk-grid-small"
                            uk-grid=""
                            uk-height-match="target: > div > .halfDonutHeight"
                          >
                            <div className="uk-width-2-5">
                              <div className="mainBox halfDonutHeight">
                                <div className="boxHeading">
                                  <span>Call Response Status</span>
                                </div>
                                <div className="boxContent">
                                  <div
                                    className="chartWrp"
                                    style={{
                                      minHeight: "260px",
                                      minWidth: "260px",
                                    }}
                                  >
                                    {data !== null &&
                                      (data?.call_reponse_status.Answered +
                                        data?.call_reponse_status.Busy +
                                        data?.call_reponse_status.DTMF +
                                        data?.call_reponse_status.Hangup +
                                        data?.call_reponse_status.No_Answers >
                                      0 ? (
                                        <PieChart
                                          degree={360}
                                          backgroudColor={[
                                            "#14B8A6",
                                            "#FACC15",
                                            "#F59E0B",
                                            "#6366F1",
                                            "#3B82F6",
                                          ]}
                                          borderColor={[
                                            "#14B8A6",
                                            "#FACC15",
                                            "#F59E0B",
                                            "#6366F1",
                                            "#3B82F6",
                                          ]}
                                          graphData={[
                                            data?.call_reponse_status.Answered,
                                            data?.call_reponse_status.DTMF,
                                            data?.call_reponse_status.Hangup,
                                            data?.call_reponse_status.Busy,
                                            data?.call_reponse_status
                                              .No_Answers,
                                          ]}
                                          graphlabels={[
                                            "Total Answer",
                                            "Total DTMF",
                                            "Total Hangup",
                                            "Total Busy",
                                            "Total No-Answers",
                                          ]}
                                        />
                                      ) : (
                                        <DoughnutChart
                                          degree={360}
                                          backgroudColor={["#B4B4B4"]}
                                          borderColor={["#B4B4B4"]}
                                          graphData={[1]}
                                          graphlabels={["-"]}
                                        />
                                      ))}
                                  </div>
                                  <div className="chartDataWrapper">
                                    <ul>
                                      <li>
                                        <p>
                                          <span className="color1"></span>
                                          Total Answer
                                        </p>
                                      </li>
                                      <li>
                                        <p>
                                          {data?.call_reponse_status.Answered}
                                        </p>
                                      </li>
                                    </ul>
                                    <ul>
                                      <li>
                                        <p>
                                          <span className="color2"></span>
                                          Total No-Answers
                                        </p>
                                      </li>
                                      <li>
                                        <p>
                                          {data?.call_reponse_status.No_Answers}
                                        </p>
                                      </li>
                                    </ul>
                                    <ul>
                                      <li>
                                        <p>
                                          <span className="color3"></span>
                                          Total Busy
                                        </p>
                                      </li>
                                      <li>
                                        <p>{data?.call_reponse_status.Busy}</p>
                                      </li>
                                    </ul>
                                    <ul>
                                      <li>
                                        <p>
                                          <span className="color4"></span>
                                          Total Hangup
                                        </p>
                                      </li>
                                      <li>
                                        <p>
                                          {data?.call_reponse_status.Hangup}
                                        </p>
                                      </li>
                                    </ul>
                                    <ul>
                                      <li>
                                        <p>
                                          <span className="color5"></span>
                                          Total DTMF
                                        </p>
                                      </li>
                                      <li>
                                        <p>{data?.call_reponse_status.DTMF}</p>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="uk-width-3-5 ">
                              <div className="mainBox halfDonutHeight">
                                <div className="boxHeading">
                                  <span>Campaign Details</span>
                                </div>
                                <div className="boxContent">
                                  <div className="progressWrp uk-margin-top">
                                    <div className="progressHeading">
                                      <div className="left">
                                        <a>
                                          Campaign Planned (
                                          {
                                            data?.campaign_details
                                              .campaign_planned
                                              .percentageConsumed
                                          }
                                          % Consumed)
                                        </a>
                                      </div>
                                      <div className="right">
                                        <span>
                                          {
                                            data?.campaign_details
                                              .campaign_planned.totalConsumed
                                          }
                                          /{" "}
                                          {
                                            data?.campaign_details
                                              .campaign_planned.totalCampaigns
                                          }
                                        </span>
                                      </div>
                                    </div>
                                    <progress
                                      className={"uk-progress progressNomral"}
                                      value={
                                        data?.campaign_details.campaign_planned
                                          .totalConsumed
                                      }
                                      max={
                                        data?.campaign_details.campaign_planned
                                          .totalCampaigns
                                      }
                                    ></progress>
                                  </div>
                                  <div className="progressWrp uk-margin-top">
                                    <div className="progressHeading">
                                      <div className="left">
                                        <a>
                                          Campaigns Executed ({" "}
                                          {
                                            data?.campaign_details
                                              .campaign_executed
                                              .percentageConsumed
                                          }
                                          % Consumed)
                                        </a>
                                      </div>
                                      <div className="right">
                                        <span>
                                          {" "}
                                          {
                                            data?.campaign_details
                                              .campaign_executed.totalConsumed
                                          }
                                          /{" "}
                                          {
                                            data?.campaign_details
                                              .campaign_executed.totalCampaigns
                                          }
                                        </span>
                                      </div>
                                    </div>
                                    <progress
                                      className={"uk-progress progressNomral"}
                                      value={
                                        data?.campaign_details.campaign_executed
                                          .totalConsumed
                                      }
                                      max={
                                        data?.campaign_details.campaign_executed
                                          .totalCampaigns
                                      }
                                    ></progress>
                                  </div>
                                  <div className="progressWrp uk-margin-top">
                                    <div className="progressHeading">
                                      <div className="left">
                                        <a>
                                          Number of Pending Campaigns (
                                          {
                                            data?.campaign_details
                                              .campaign_pending
                                              .percentageConsumed
                                          }
                                          % consumed)
                                        </a>
                                      </div>
                                      <div className="right">
                                        <span>
                                          {" "}
                                          {
                                            data?.campaign_details
                                              .campaign_pending.totalPendings
                                          }
                                          /{" "}
                                          {
                                            data?.campaign_details
                                              .campaign_pending.totalCampaigns
                                          }
                                        </span>
                                      </div>
                                    </div>
                                    <progress
                                      className={"uk-progress progressNomral"}
                                      value={
                                        data?.campaign_details.campaign_pending
                                          .totalPendings
                                      }
                                      max={
                                        data?.campaign_details.campaign_pending
                                          .totalCampaigns
                                      }
                                    ></progress>
                                  </div>

                                  <div className="progressWrp uk-margin-top">
                                    <div className="progressHeading">
                                      <div className="left">
                                        <a>
                                          Total Uploaded Numbers (
                                          {
                                            data?.campaign_details
                                              .campaign_uploaded_numbers
                                              .percentageConsumed
                                          }
                                          % consumed)
                                        </a>
                                      </div>
                                      <div className="right">
                                        <span>
                                          {
                                            data?.campaign_details
                                              .campaign_uploaded_numbers
                                              .totalPendingNumbers
                                          }
                                          /
                                          {
                                            data?.campaign_details
                                              .campaign_uploaded_numbers
                                              .totalNumbers
                                          }
                                        </span>
                                      </div>
                                    </div>
                                    <progress
                                      className={"uk-progress progressNomral"}
                                      value={
                                        data?.campaign_details
                                          .campaign_uploaded_numbers
                                          .totalPendingNumbers
                                      }
                                      max={
                                        data?.campaign_details
                                          .campaign_uploaded_numbers
                                          .totalNumbers
                                      }
                                    ></progress>
                                  </div>
                                  <div className="progressWrp uk-margin-top">
                                    <div className="progressHeading">
                                      <div className="left">
                                        <a>
                                          Total Accepted Numbers (
                                          {
                                            data?.campaign_details
                                              .campaign_accepted_numbers
                                              .percentageConsumed
                                          }
                                          % Consumed)
                                        </a>
                                      </div>
                                      <div className="right">
                                        <span>
                                          {
                                            data?.campaign_details
                                              .campaign_accepted_numbers
                                              .totalAcceptedNumbers
                                          }
                                          /
                                          {
                                            data?.campaign_details
                                              .campaign_accepted_numbers
                                              .totalNumbers
                                          }
                                        </span>
                                      </div>
                                    </div>
                                    <progress
                                      className={"uk-progress progressNomral"}
                                      value={
                                        data?.campaign_details
                                          .campaign_accepted_numbers
                                          .totalAcceptedNumbers
                                      }
                                      max={
                                        data?.campaign_details
                                          .campaign_accepted_numbers
                                          .totalNumbers
                                      }
                                    ></progress>
                                  </div>
                                  <div className="progressWrp uk-margin-top">
                                    <div className="progressHeading">
                                      <div className="left">
                                        <a>
                                          Total Answered Numbers (
                                          {
                                            data?.campaign_details
                                              .campaign_answered_numbers
                                              .percentageConsumed
                                          }
                                          % Consumed)
                                        </a>
                                      </div>
                                      <div className="right">
                                        <span>
                                          {
                                            data?.campaign_details
                                              .campaign_answered_numbers
                                              .totalAnsweredNumbers
                                          }
                                          /
                                          {
                                            data?.campaign_details
                                              .campaign_answered_numbers
                                              .totalNumbers
                                          }
                                        </span>
                                      </div>
                                    </div>
                                    <progress
                                      className={"uk-progress progressNomral"}
                                      value={
                                        data?.campaign_details
                                          .campaign_answered_numbers
                                          .totalAnsweredNumbers
                                      }
                                      max={
                                        data?.campaign_details
                                          .campaign_answered_numbers
                                          .totalNumbers
                                      }
                                    ></progress>
                                  </div>
                                  <div className="progressWrp uk-margin-top">
                                    <div className="progressHeading">
                                      <div className="left">
                                        <a>
                                          Total No-Answered Numbers (
                                          {
                                            data?.campaign_details
                                              .campaign_noanswered_numbers
                                              .percentageConsumed
                                          }
                                          % Consumed)
                                        </a>
                                      </div>
                                      <div className="right">
                                        <span>
                                          {
                                            data?.campaign_details
                                              .campaign_noanswered_numbers
                                              .totalNoAnsweredNumbers
                                          }
                                          /
                                          {
                                            data?.campaign_details
                                              .campaign_noanswered_numbers
                                              .totalNumbers
                                          }
                                        </span>
                                      </div>
                                    </div>
                                    <progress
                                      className={"uk-progress progressNomral"}
                                      value={
                                        data?.campaign_details
                                          .campaign_noanswered_numbers
                                          .totalNoAnsweredNumbers
                                      }
                                      max={
                                        data?.campaign_details
                                          .campaign_noanswered_numbers
                                          .totalNumbers
                                      }
                                    ></progress>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mainBox">
                          <div className="boxContent" style={{ height: "200px" }}>
                            <LineChart
                              dataValues={data?.chartData}
                              label={data?.dateLabels}
                              Title={"Numbers Details"}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
