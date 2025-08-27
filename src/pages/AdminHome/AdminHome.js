import {
  Add,
  Phone,
  PhoneApplication,
  PhoneOff,
  UserServiceDesk,
} from "@carbon/icons-react";
import React, { useState, useEffect } from "react";
import PieChart from "../../components/Graph/PieChart";
import { useAuth } from "../../Context/AuthProvider";
import { apiGet } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";
import { useNavigate } from "react-router-dom";
import SiteOverviewChart from "../../components/newcomponents/graphcards/SiteOverviewChart";
import LeadsOverviewChart from "../../components/newcomponents/circlechart/LeadsOverviewChart";
import BarChart from "../../components/newcomponents/barchart/InquiryTrackingChart";
import LeadsStatusTwo from "../../components/newcomponents/LeadsStatusTwo";
import ScheduleTwo from "../../components/newcomponents/ScheduleTwo";
import { leadsStatusData } from '../../Utils/fackData/leadsStatusData'




const AdminHome = () => {

  const navigate = useNavigate();
  const { auth } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const colors = ["#14B8A6", "#FACC15", "#F59E0B"];
  const fetchDashboard = () => {
    setIsLoading(true);
    const onSuccess = (response) => {
      setData(response.data);
      setIsLoading(false);
    };

    const onFailure = (error) => {
      console.error("Failed to fetch dashboard:", error);
      setIsLoading(false);
    };

    apiGet('/admin/dashboard', onSuccess, onFailure);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);



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
                <div className="uk-grid uk-flex-middle" uk-grid="">
                  <div className="uk-width-1-1 uk-margin-remove-top">
                    <div
                      className="analyticsWhatsappContent"
                      style={{ marginTop: "16px" }}
                    >
                      <div className="uk-grid uk-flex-middle" uk-grid="">
                        <div className="uk-width-1-2 uk-margin-remove">
                          <h2 className="uk-margin-remove">Dalda | {auth?.user?.name}</h2>
                          <p className="uk-margin-remove">
                            Activations | Call Center | Social Media
                          </p>
                        </div>


                        <div className="uk-width-1-1 uk-margin-remove">
                          <div className="overviewMainContent">
                            <div className="uk-margin">
                              <div className="">
                                <div className="uk-grid uk-grid-small" uk-grid="">
                                  <SiteOverviewChart />
                                </div>
                              </div>
                            </div>

                            <div className="uk-grid uk-grid-small" uk-grid="" uk-height-match="target: >div> div " >
                              <div className="uk-width-1-3 " >

                                <LeadsOverviewChart chartHeight={340} />
                              </div>

                              <div className="uk-width-expand h-match">
                              <div className="card" >
                                  <div className="card-header">
                                    <h5 className="card-title mb-0">Top Anchors</h5>
                                  </div>
                                  <div className="card-">
                                    <div className="table-responsive">
                                      <table className="table table-hover table-striped table align-middle mb-0" style={{ minWidth: 650 }}>
                                        <thead className="text-center">
                                          <tr>
                                            <th>Anchor</th>
                                            <th>City</th>
                                            <th>Area</th>
                                            <th>Status</th>
                                            <th>Sales Count</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-center">
                                          {AnchorData.map(({ AreaName, AnchorName, AnchorPhone, AnchorRole, AnchorCity, NumberOfSales }, idx) => (
                                            <tr key={AnchorName} >
                                              <td className="d-flex justify-content-center align-items-center">
                                                <div className="d-flex align-items-center" style={{ gap: 16 }}>
                                                  <img
                                                    src={'https://randomuser.me/api/portraits/women/2.jpg'}
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
                                              <td>
                                                <span className="fs-6">{AnchorCity}</span>
                                              </td>
                                              <td>
                                                <span className="fs-6">{AreaName}</span>
                                              </td>
                                              <td>
                                                <span className={`badge bg-soft-success text-success px-3 py-2 fs-6`} style={{ fontWeight: 500 }}>
                                                  {AnchorRole}
                                                </span>
                                              </td>
                                              <td>
                                                <span className="fw-bold fs-6">{NumberOfSales}</span>
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

                            <div className="uk-grid uk-grid-small" uk-grid="" uk-height-match="target: >div> div ">

                              <div className="uk-width-1-2 uk-margin-remove">
                              <BarChart />

                              </div>



                                <div className="uk-width-1-2 uk-margin-remove">
                                    <ScheduleTwo title="Upcoming Events" />
                                </div>
                            </div>

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
  );
};

export default AdminHome;
