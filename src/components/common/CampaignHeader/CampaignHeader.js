import React from "react";
import campaignLogo from "../../../assets/images/jeetkibaazi-logo.png";
import { CAMPAIGN_NAME } from "../../../Utils/appConfig";

// Header strip shared by Home and LuckyDraw: Convex branding on the left, Jeet ki Baazi sticker on the right
const CampaignHeader = ({ children, geoName }) => {
  return (
    <div className="uk-width-1-1 uk-flex uk-flex-between uk-flex-middle main-content-card campaign-header">
      <div className="campaign-header-brand">
        <img className="campaign-header-convex" src="/assets/images/convexlogowhite.png" alt="Convex Interactive" />
        {/* {geoName && <span className="campaign-header-geo">{geoName} Geo</span>} */}
      </div>
      {children && <div className="campaign-header-center">{children}</div>}
      <div className="campaign-header-sticker">
        <img className="campaign-header-logo" src={campaignLogo} alt={`${CAMPAIGN_NAME} Logo`} />
      </div>
    </div>
  );
};

export default CampaignHeader;
