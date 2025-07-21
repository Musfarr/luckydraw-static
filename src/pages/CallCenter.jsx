import React, { useState, useEffect } from "react";
import Spinner from "../reusables/Spinner";
import LeadsStatistics from "../components/newcomponents/LeadsStatistics";

const CallCenter = () => {
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
              <div className="uk-width-1-1 uk-margin-remove-top">
                <div className="analyticsWhatsappContent" style={{ marginTop: "16px" }}>
                  <div className="uk-grid uk-flex-middle" uk-grid="">
                    <div className="uk-width-1-1">
                      <h2 className="uk-margin-remove">Call Center</h2>
                      <p className="uk-margin-remove">Activations | Call Center | Social Media</p>
                    </div>
                  </div>
                  
                  <LeadsStatistics />
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
