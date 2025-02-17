import React from 'react';
import 'uikit/dist/css/uikit.min.css'; // Make sure UIkit CSS is imported

const CustomizedProgressBar = ({ value, max, color }) => {
  return (
    <>
    <div className='barWrap'></div>
    <progress
      className="uk-progress custom-progress-bar"
    //   className=" custom-progress-bar"
      value={value}
      max={max}
      style={{
        '--progress-bar-color': color,
      }}
    ></progress>
    </>
  );
};
export default CustomizedProgressBar;



