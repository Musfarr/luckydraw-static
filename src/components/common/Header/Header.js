import React from "react";
import berryTalkLogo from "../../../assets/images/splashicon.svg";

const Header = () => {
  return (
    <>
      <header>
        <div uk-grid="" className="uk-grid uk-flex-middle">
          <div className="uk-width-1-2">
            <div className="logowrp">
              <img src={berryTalkLogo} alt="" style={{width:'60px'}} />
            </div>
          </div>
          <div className="uk-width-1-2">
            <div className="txtwrp">
              <a href="/support">Need help</a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
