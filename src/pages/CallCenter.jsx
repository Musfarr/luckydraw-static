import React, { useState, useEffect } from "react";
import Spinner from "../reusables/Spinner";
import LeadsStatistics from "../components/newcomponents/LeadsStatistics";
import InvoiceSummary from "../components/newcomponents/InvoiceSummary";
import CallCenterTable from "../components/newcomponents/CallCenterTable";
import CallCenterStats from "../components/newcomponents/CallCenterStats";
import { callcenterstaticdata } from "../Utils/callcenterstaticdata";
import RadialProgress from "../components/newcomponents/RadialProgress/RadialProgress";
import ReactApexChart from "react-apexcharts";


const CallCenter = () => {
  const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);


  const chartOptions = {
    chart: {
        stacked: !1,
        toolbar: {
            show: !1
        }
    },
    stroke: {
        show: !1
    },
    plotOptions: {
        bar: {
            borderRadius: 0,
            borderRadiusApplication:"end",
            columnWidth: "30%",
            distributed: !0,
            dataLabels: {
                position: "top"
            }
        }
    },
    dataLabels: {
        enabled: !0,
        formatter: function (e) {
            return e + "MIN"
        },
        offsetY: 20,
        style: {
            fontSize: "12px",
            colors: ["#304758"]
        }
    },
    dataLabels: {
        enabled: !1
    },
    colors: ["#23d47d"],
    series: [
        {
            name: "Spent",
            data: [200, 300, 400, 500, 460, 420, 380]
        }
    ],
    markers: {
        size: 0
    },
    xaxis: {
        categories: ["SAT", "SUN", "MON", "THU", "WEN", "THU", "FRI"],
        axisBorder: {
            show: !1
        },
        axisTicks: {
            show: !1
        },
        labels: {
            style: {
                fontSize: "10px",
                colors: "#64748b"
            }
        }
    },
    yaxis: {
        min:0,
        max:500,
        tickAmount: 5,
        labels: {
            formatter: function (e) {
                return +e + "M"
            },
            offsetX: 2,
            offsetY: 0,
            style: {
                color: "#64748b"
            }
        }
    },
    grid: {
        xaxis: {
            lines: {
                show: !1
            }
        },
        yaxis: {
            lines: {
                show: !1
            }
        },
        padding:{
            left:23,
            bottom:0
        }
    },
    tooltip: {
        y: {
            formatter: function (e) {
                return +e + " MIN"
            }
        },
        style: {
            fontSize: "12px",
            fontFamily: "Inter"
        }
    },
    legend: {
        show: !1,
        labels: {
            fontSize: "12px",
            colors: "#64748b"
        },
        fontSize: "12px",
        fontFamily: "Inter"
    }
};

  return (
    <div className="boradcastWrp">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="broadcastContentWrp">
          <div className="overviewContent">
            <div className="uk-container uk-container-xlarge">
              <div className="uk-width-1-1 uk-margin-remove-top">
                <div className="analyticsWhatsappContent" style={{ marginTop: "16px" }}>
                  <div className="uk-grid uk-flex-middle" uk-grid="">
                    <div className="uk-width-1-1">
                      <h2 className="uk-margin-remove">Call Center</h2>
                      <p className="uk-margin-remove">Activations | Call Center | Social Media</p>
                    </div>
                  </div>
                  
                  <div className="uk-margin">
                    <CallCenterStats data={callcenterstaticdata} />
                  </div>


                    <div className="uk-margin " uk-grid="" uk-height-match="target: > div > div">
                      <div className="uk-width-1-3">
                        <RadialProgress />
                      </div>

                      <div className="uk-width-expand">
                        <div className="card">
                          <div className="card-header">
                            <h5 className="card-title">Weekly Call Time Spent</h5>
                          </div>

                          <div className="card-body custom-ard-action p-0">
                            <ReactApexChart
                              type='bar'
                              options={chartOptions}
                              series={chartOptions.series}
                              height={425}
                            />
                          </div>
                          <div style={{backgroundColor:"#fff"}} className="card-footer hstack justify-content-around">
                            <div className="text-center">
                              <h4 href="#" className="fs-16 fw-bold">66H:35M</h4>
                              <div className=" text-muted">Billable Hours</div>
                            </div>
                            <span className="vr"></span>
                            <div className="text-center">
                              <h4 href="#" className="fs-16 fw-bold">06H:25M</h4>
                              <div className="text-muted">Unbillable Hours</div>
                            </div>
                          </div>

                          {/* <CardLoader refreshKey={refreshKey} /> */}
                        </div>
                      </div>
                    </div>



                  
                  {/* <LeadsStatistics /> */}

                  <div className="uk-margin-top">
                    <CallCenterTable data={callcenterstaticdata} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallCenter;
