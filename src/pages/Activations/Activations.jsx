import React, { useEffect, useState } from 'react'
import Spinner from '../../reusables/Spinner'
import LeadsStatistics from '../../components/newcomponents/LeadsStatistics'
import InvoiceSummary from '../../components/newcomponents/InvoiceSummary'
import EstimateStatistics from '../../components/newcomponents/EstimateStatistics'
import TopCountryChart from '../../components/newcomponents/VerticalBAr/TopCountryChart'
import VisitorsOverviewChart from '../../components/newcomponents/AreaChart/VisitorsOverviewChart'


const Activations = () => {

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
                      <h2 className="uk-margin-remove">Activations</h2>
                      <p className="uk-margin-remove">Activations | Social Media</p>
                    </div>
                  </div>
                  
                  <div className="uk-margin-medium-top">
                    <div className="uk-grid uk-child-width-1-4@m uk-child-width-1-2@s uk-grid-medium" uk-grid="">
                      <EstimateStatistics />
                    </div>
                  </div>
                </div>
                    


                <div className="uk-margin-top  ">
                <div className='uk-margin-top'>
                    <div className="uk-grid uk-child-width-1-2@m uk-child-width-1-2@s uk-grid-medium" uk-grid="">
                        <VisitorsOverviewChart />
                        <TopCountryChart />  
                    </div>
                </div>
                </div>
                <div className="uk-margin-top  ">
                <div className='uk-margin-top'>
                  <InvoiceSummary title="Campaigns" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Activations