import React, { useState, useEffect } from "react";
import Spinner from "../reusables/Spinner";
import InquiryTrackingChart from "../components/newcomponents/barchart/InquiryTrackingChart";
import SocialMediaStatisticsChart from "../components/newcomponents/radar/SocialMediaStatisticsChart";
import Customers from "../components/newcomponents/Customers";

const SocialMedia = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
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
                  <div className="analyticsWhatsappContent" style={{ marginTop: "16px" }}>
                    <div className="uk-grid uk-flex-middle" uk-grid="">
                      <div className="uk-width-1-2 uk-margin-remove">
                        <h2 className="uk-margin-remove">Social Media</h2>
                        <p className="uk-margin-remove"> Campaigns | Reviews</p>
                      </div>
                      <div className="uk-width-1-1 uk-margin-remove">
                        <div className="overviewMainContent">
                          <div className="uk-margin">
                              <div className="uk-grid uk-grid-small" uk-grid="" uk-height-match="target: > div > div" >
                              <div className="uk-width-1-2">
                                  <div className="mainBox">
                                    <div className="boxHeading">
                                      <div className="fw-bold mb-2 text-dark text-truncate-1-line">Total Engagement</div>
                                    </div>
                                    <InquiryTrackingChart/>
                                  </div>
                                </div>
                              <div className="uk-width-1-2">
                                  <div className="mainBox">
                                    <div className="boxHeading">
                                      <div className="fw-bold mb-2 text-dark text-truncate-1-line">Total Engagement</div>
                                    </div>
                                    <SocialMediaStatisticsChart/>
                                  </div>
                                </div>




                            </div>
                          </div>
                          
                        </div>


                            <div className="">
                                <div className="uk-width-1-1">                        
                                  <Customers title="Influencers"/>
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

export default SocialMedia;
