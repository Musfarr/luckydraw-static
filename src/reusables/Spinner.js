import React from 'react'
import "./spinner.css"
const Spinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        <div className="uk-spinner " uk-spinner="ratio: 3.5"></div>
      </div>
    </div>
  )
}

export default Spinner