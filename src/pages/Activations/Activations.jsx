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

      const [playingIdx, setPlayingIdx] = useState(null);

const handleToggle = (idx) => {
  setPlayingIdx(playingIdx === idx ? null : idx);
};

      const AnchorData = [{
        "AnchorName": "Ghazal",
        "AnchorPhone": "03111234569",
        "AnchorRole": "Muhalla Anchor",
        "AnchorCity": "Karachi",
        "AreaName": "Lines Area",
        "ProductName": "Harpic",
        "ProgramDate": "2025-06-04",
        "ProgramNumber": "Program 1",
        "NumberOfInvitations": 24,
        "NumberOfAttendees": 14,
        "NumberOfSales": 11,
        "HbcSold": 0,
        "HtcSold": 11,
        "location": "Lines Area",
        "SessionStart": "2025-06-04 11:44:16",
        "SessionEnd": "2025-06-04 12:09:59",
        "RecordingURL": "https://pomeinsights.com/api/auth/audio/recordings/T2025-06-0411-44-16-P40136-U384.mp3"
    },
    {
        "AnchorName": "Ghazal",
        "AnchorPhone": "03412501550",
        "AnchorRole": "Muhalla Anchor",
        "AnchorCity": "Karachi",
        "AreaName": "Lines Area",
        "ProductName": "Harpic",
        "ProgramDate": "2025-06-04",
        "ProgramNumber": "Program 1",
        "NumberOfInvitations": 24,
        "NumberOfAttendees": 14,
        "NumberOfSales": 11,
        "HbcSold": 0,
        "HtcSold": 11,
        "location": "Lines Area",
        "SessionStart": "2025-06-04 11:44:16",
        "SessionEnd": "2025-06-04 12:09:59",
        "RecordingURL": "https://pomeinsights.com/api/auth/audio/recordings/T2025-06-0411-44-16-P40136-U384.mp3"
    },
    {
        "AnchorName": "Neelam",
        "AnchorPhone": "03142253304",
        "AnchorRole": "Muhalla Anchor",
        "AnchorCity": "Karachi",
        "AreaName": "Lines Area",
        "ProductName": "Harpic",
        "ProgramDate": "2025-06-04",
        "ProgramNumber": "Program 1",
        "NumberOfInvitations": 24,
        "NumberOfAttendees": 14,
        "NumberOfSales": 11,
        "HbcSold": 0,
        "HtcSold": 11,
        "location": "Lines Area",
        "SessionStart": "2025-06-04 11:44:16",
        "SessionEnd": "2025-06-04 12:09:59",
        "RecordingURL": "https://pomeinsights.com/api/auth/audio/recordings/T2025-06-0411-44-16-P40136-U384.mp3"
    },
    {
        "AnchorName": "Saima Riffat",
        "AnchorPhone": "03100082083",
        "AnchorRole": "Muhalla Anchor",
        "AnchorCity": "Karachi",
        "AreaName": "Lines Area",
        "ProductName": "Harpic",
        "ProgramDate": "2025-06-04",
        "ProgramNumber": "Program 1",
        "NumberOfInvitations": 24,
        "NumberOfAttendees": 14,
        "NumberOfSales": 11,
        "HbcSold": 0,
        "HtcSold": 11,
        "location": "Lines Area",
        "SessionStart": "2025-06-04 11:44:16",
        "SessionEnd": "2025-06-04 12:09:59",
        "RecordingURL": "https://pomeinsights.com/api/auth/audio/recordings/T2025-06-0411-44-16-P40136-U384.mp3"
    },
    {
        "AnchorName": "Sarim",
        "AnchorPhone": "03132624487",
        "AnchorRole": "Muhalla Anchor",
        "AnchorCity": "Karachi",
        "AreaName": "Lines Area",
        "ProductName": "Harpic",
        "ProgramDate": "2025-06-04",
        "ProgramNumber": "Program 1",
        "NumberOfInvitations": 24,
        "NumberOfAttendees": 14,
        "NumberOfSales": 11,
        "HbcSold": 0,
        "HtcSold": 11,
        "location": "Lines Area",
        "SessionStart": "2025-06-04 11:44:16",
        "SessionEnd": "2025-06-04 12:09:59",
        "RecordingURL": "https://pomeinsights.com/api/auth/audio/recordings/T2025-06-0411-44-16-P40136-U384.mp3"
    },
    {
        "AnchorName": "Sobia",
        "AnchorPhone": "03150117475",
        "AnchorRole": "Muhalla Anchor",
        "AnchorCity": "Karachi",
        "AreaName": "Lines Area",
        "ProductName": "Harpic",
        "ProgramDate": "2025-06-04",
        "ProgramNumber": "Program 1",
        "NumberOfInvitations": 24,
        "NumberOfAttendees": 14,
        "NumberOfSales": 11,
        "HbcSold": 0,
        "HtcSold": 11,
        "location": "Lines Area",
        "SessionStart": "2025-06-04 11:44:16",
        "SessionEnd": "2025-06-04 12:09:59",
        "RecordingURL": "https://pomeinsights.com/api/auth/audio/recordings/T2025-06-0411-44-16-P40136-U384.mp3"
    },];
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
                  {/* <InvoiceSummary title="Campaigns" /> */}

                  {/* Top Anchors Table - with more details */}
                  <div className="card mt-4">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Top Anchors</h5>
                    </div>
                    <div className="cardbody">
                      <div className="table-responsive">
                        <table className="table table-hover table-striped align-middle mb-0" style={{ minWidth: 900 }}>
                          <thead className="text-center">
                            <tr>
                              <th>Anchor</th>
                              <th>City</th>
                              <th>Area</th>
                              <th>Status</th>
                              <th>Invitations</th>
                              <th>Attendees</th>
                              <th>HBC Sold</th>
                              <th>HTC Sold</th>
                              <th>Recording</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {AnchorData.map(({ AreaName, AnchorName, AnchorPhone, AnchorRole, AnchorCity, NumberOfInvitations, NumberOfAttendees, HbcSold, HtcSold, RecordingURL }, idx) => (
                              <tr key={AnchorName + idx}>
                                <td className="">
                                  <div className="d-flex justify-content-center" style={{ gap: 16 }}>
                                    <img
                                      src={'https://randomuser.me/api/portraits/women/4.jpg'}
                                      alt="img"
                                      className="img-fluid rounded-circle border"
                                      style={{ width: 48, height: 48, objectFit: 'cover' }}
                                    />
                                    <div className="text-start">
                                      <div className="fw-bold fs-6" style={{ color: '#19325a' }}>{AnchorName}</div>
                                      <div className="text-muted fs-7">{AnchorPhone}</div>
                                    </div>
                                  </div>
                                </td>
                                <td><span className="fs-6">{AnchorCity}</span></td>
                                <td><span className="fs-6">{AreaName}</span></td>
                                <td>
                                  <span className={`badge bg-soft-success text-success px-3 py-2 fs-6`} style={{ fontWeight: 500 }}>
                                    {AnchorRole}
                                  </span>
                                </td>
                                <td>{NumberOfInvitations}</td>
                                <td>{NumberOfAttendees}</td>
                                <td>{HbcSold}</td>
                                <td>{HtcSold}</td>
                                <td   > 
                                  <div className="d-flex justify-content-center">
                                    <input
                                      type="checkbox"
                                      className="audio-toggle"
                                      id={`checkboxInput${idx}`}
                                      checked={playingIdx === idx}
                                      onChange={() => handleToggle(idx)}
                                    />
                                    <label htmlFor={`checkboxInput${idx}`} className="toggleSwitch">
                                      <div className="speaker">
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 75 75">
                                          <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style={{stroke: '#fff', strokeWidth: 5, strokeLinejoin: 'round', fill: '#fff'}} />
                                          <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style={{fill: 'none', stroke: '#fff', strokeWidth: 5, strokeLinecap: 'round'}} />
                                        </svg>
                                      </div>
                                      <div className="mute-speaker">
                                        <svg version="1.0" viewBox="0 0 75 75" stroke="#fff" strokeWidth={5}>
                                          <path d="m39,14-17,15H6V48H22l17,15z" fill="#fff" strokeLinejoin="round" />
                                          <path d="m49,26 20,24m0-24-20,24" fill="#fff" strokeLinecap="round" />
                                        </svg>
                                      </div>
                                    </label>
                                    {playingIdx === idx && (
                                      <audio
                                      
                                        src={RecordingURL}
                                        autoPlay
                                        controls
                                        style={{ display: 'none', width: 120, marginLeft: 8, verticalAlign: 'middle' }}
                                        onEnded={() => setPlayingIdx(null)}
                                      />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

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