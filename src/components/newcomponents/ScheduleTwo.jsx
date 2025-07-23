import React from 'react'
import { Link } from 'react-router-dom'
import { upcomingEventsData } from '../../Utils/fackData/upcomingEventsData'



const ScheduleTwo = ({ title, data }) => {

    
    return (
            <div className={`card `}>
                <div className="card-header">
                    <h5 className="card-title">{title}</h5>
                </div>
                <div className="card-body p-2 custom-card-action p-0">
                    <ul className="list-group list-group-flush upcoming-event-report-lead">
                        {upcomingEventsData?.map(({ date, id, schedule_name, team_members }) => (
                            <li key={id} className="list-group-item">
                                <div className="d-sm-flex justify-content-between">
                                    <div className="hstack gap-3">
                                        <div className="ht-60 wd-60 border bg-gray-200 rounded-3 d-flex flex-column justify-content-center text-center">
                                            <span className=" fw-bolder text-dark">{date.day}</span>
                                            <span className="fs-10 text-uppercase">{date.month}</span>
                                        </div>
                                        <div className="me-4">
                                            <p className="fs-12 fw-bold text-muted mb-2">{date.time}</p>
                                            <span className="fw-medium text-truncate-1-line">{schedule_name}</span>
                                        </div>
                                    </div>
                                    {/* <div className="img-group lh-0 ms-2 justify-content-start d-none d-sm-flex">
                                        <ImageGroup data={team_members} avatarSize='avatar-md' avatarMore={"35+"} />
                                    </div> */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
    )
}

export default ScheduleTwo