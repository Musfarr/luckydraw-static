import React from "react";
import { currentYear } from "../../../Utils/DateFunctions";

const Footer = ({ color, extraPadding }) => {
  const name = process.env.REACT_APP_PORTAL_NAME
  return (
    <div className="uk-position-relative">
      <div
        className="footerwrp"
        style={{ backgroundColor: color, paddingLeft: extraPadding }}
      >
        <div uk-grid="" className="uk-grid">
          <div className="uk-width-1-2">
            <div className="txtwrp">
              <span style={{ color: '#000' }} >© {currentYear()}{' '} {name}. All rights reserved.</span>
            </div>
          </div>
          <div className="uk-width-1-2">
            <div className="brandName">
              <span>Powered by Convex Interactive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
