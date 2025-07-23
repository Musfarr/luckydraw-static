import React from 'react'
import "./spinner.css"

const Spinner = () => {
  return (
    <div className="loading-spinner-overlay uk-flex uk-flex-center uk-flex-middle" style={{zIndex:1, width:"100%", height:"100%"}}>
      {/* <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg> */}
      <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
	<circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
	<circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
	<circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
	<circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
</svg>
    </div>
  )
}

export default Spinner