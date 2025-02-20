import React from 'react'
import "./spinner.css"
const Spinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        <div className="spinner-ring-loader"></div>
      </div>
    </div>
  )
}

export default Spinner