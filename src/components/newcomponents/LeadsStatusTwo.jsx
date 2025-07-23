import React from 'react'
import { leadsStatusData } from '../../Utils/fackData/leadsStatusData'
import { Link } from 'react-router-dom'

const LeadsStatusTwo = () => {
    return (
        <div className="">
            <div className={`card stretch stretch-full`}>
                <div className="card-header">
                    <h5 className="card-title">Top Anchors</h5>
                </div>
                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover ">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col" className="wd-100">Sale Rep.</th>
                                    <th scope="col">Contacted</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leadsStatusData?.map(({ date, id, img, name, status, value, badgeColor }) => (
                                        <tr key={id} className='leads-status'>
                                            <td className="position-relative">
                                                <div className={`ht-50 position-absolute start-0 top-50 translate-middle rounded border-start border-5`}></div>
                                                <p className="mb-0 fw-medium">{name}</p>
                                            </td>
                                            <td>
                                                <div className="avatar-image avatar-md">
                                                    <img src={img} alt="img" className="img-fluid" />
                                                </div>
                                            </td>
                                            <td>{date}</td>
                                            <td>
                                                <span className={`badge bg-soft-${badgeColor} text-${badgeColor}`}>{status}</span>
                                            </td>
                                            <td><p className="mb-0 fw-medium">${value}</p></td>
                                        </tr>
                                    )
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeadsStatusTwo
