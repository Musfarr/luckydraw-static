import {
  Add,
  Phone,
  PhoneApplication,
  PhoneOff,
  UserServiceDesk,
} from "@carbon/icons-react";
import React, { useState, useEffect } from "react";
import PieChart from "../../components/Graph/PieChart";
import { useAuth } from "../../Context/AuthProvider";
import { apiGet } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";
import { useNavigate } from "react-router-dom";
import SiteOverviewChart from "../../components/newcomponents/graphcards/SiteOverviewChart";
import LeadsOverviewChart from "../../components/newcomponents/circlechart/LeadsOverviewChart";
import BarChart from "../../components/newcomponents/barchart/InquiryTrackingChart";
import LeadsStatusTwo from "../../components/newcomponents/LeadsStatusTwo";
import ScheduleTwo from "../../components/newcomponents/ScheduleTwo";




const AdminHome = () => {

  const navigate = useNavigate();
  const { auth } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const colors = ["#14B8A6", "#FACC15", "#F59E0B"];
  const fetchDashboard = () => {
    setIsLoading(true);
    const onSuccess = (response) => {
      setData(response.data);
      setIsLoading(false);
    };

    const onFailure = (error) => {
      console.error("Failed to fetch dashboard:", error);
      setIsLoading(false);
    };

    apiGet('/admin/dashboard', onSuccess, onFailure);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="boradcastWrp">
      {isLoading ? (
        <Spinner />
      ) : (
          <div className="broadcastContentWrp">
            <div className="overviewContent">
              <div className="uk-container uk-container-xlarge">
                <div className="uk-grid uk-flex-middle" uk-grid="">
                  <div className="uk-width-1-1 uk-margin-remove-top">
                    <div
                      className="analyticsWhatsappContent"
                      style={{ marginTop: "16px" }}
                    >
                      <div className="uk-grid uk-flex-middle" uk-grid="">
                        <div className="uk-width-1-2 uk-margin-remove">
                          <h2 className="uk-margin-remove">Dalda | {auth?.user?.name}</h2>
                          <p className="uk-margin-remove">
                            Activations | Call Center | Social Media
                          </p>
                        </div>


                        <div className="uk-width-1-1 uk-margin-remove">
                          <div className="overviewMainContent">
                            <div className="uk-margin">
                              <div className="">
                                <div className="uk-grid uk-grid-small" uk-grid="">
                                  <SiteOverviewChart />
                                </div>
                              </div>
                            </div>

                            <div className="uk-grid uk-grid-small" uk-grid="" uk-height-match="target: >div " >
                              <div className="uk-width-1-3 h-match" >

                                <LeadsOverviewChart chartHeight={340} />
                              </div>

                              <div className="uk-width-expand h-match">
                                <BarChart />
                              </div>
                            </div>

                            <div className="uk-grid uk-grid-small" uk-grid="">
                                <div className="uk-width-1-2 uk-margin-remove">
                                    <LeadsStatusTwo />
                                </div>
                                <div className="uk-width-1-2 uk-margin-remove">
                                    <ScheduleTwo title="Upcoming Events" />
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
      )}
    </div>
  );
};

export default AdminHome;
