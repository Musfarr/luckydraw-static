import { ArrowDown, ArrowUp } from '@carbon/icons-react'
import React from 'react'

const data = [
    { title: "Total Inquiry", average_value: "32", average_value_count: "K", curret_value: "+20.36", trend: "up" },
    { title: "Performance", average_value: "45.68", average_value_count: "%", curret_value: "-10.46", trend: "down" },
    { title: "Escalations", average_value: "985", average_value_count: "", curret_value: "+25.48", trend: "up" },
    { title: "SLA Compliant", average_value: "895", average_value_count: "", curret_value: "+15.39", trend: "up" },
    { title: "Avg. Time (H)", average_value: "03.45", average_value_count: "", curret_value: "-12.86", trend: "down" },
    { title: "Avg. Fullfilment", average_value: "65.95", average_value_count: "%", curret_value: "+20.35", trend: "up" },
]

const LeadsStatistics = () => {
    return (
        <div className="leads-statistics-grid">
            {
                data.map(({ average_value, average_value_count, curret_value, title, trend }, index) => {
                    return (
                        <div key={index} className="leads-report-card" style={{borderRadius:"10px"}}>
                            <div className="card stretch stretch-full">
                                <div className="card-body">
                                    <div className="fs-12 fw-medium text-muted mb-3">{title}</div>
                                    <div className="hstack justify-content-between lh-base">
                                        <h3><span className="counter">{average_value}</span>{average_value_count}</h3>
                                        <div className={`hstack gap-2 fs-11 ${trend === "up" ? "text-success" : "text-danger"} `}>
                                            <i className="fs-12">
                                                {
                                                    trend === "up" ?
                                                        <ArrowUp />
                                                        :
                                                        <ArrowDown />
                                                }
                                            </i>
                                            <span>{curret_value}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default LeadsStatistics
