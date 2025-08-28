import React from "react";
import { Link } from "react-router-dom";
import notFoundImg from '../../assets/images/berrytalks-404.png'

const NotFound = () => {
  return (
    <>
      <div className="notFoundWrp">
        <div className='imgwrp'>
          <img src={notFoundImg} alt="" />
        </div>
        <div className="btnwrp">
          <Link onClick={()=>window.location.href = '/home'}>Back to home</Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
