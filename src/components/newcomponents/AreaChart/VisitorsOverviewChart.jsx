import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { visitorChartOption } from '../../../Utils/chartsLogic/visitorChartOption'

const VisitorsOverviewChart = () => {
    const chartOptions = visitorChartOption()

    return (
        <div className="col-xxl-8">
            <div className={`card stretch stretch-full`}>
                {/* <CardHeader title={"Visitors Overview"} /> */}
                
                <div className="card-header">
                    <h5 className="card-title">Monthly Sales Overview </h5>
                </div>
                <div className="card-body custom-card-action">
                    <ReactApexChart
                        type='area'
                        options={chartOptions}
                        series={chartOptions.series}
                        height={580 }
                    />
                </div>
            </div>
        </div>
    )
}

export default VisitorsOverviewChart