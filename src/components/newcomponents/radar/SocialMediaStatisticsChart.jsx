import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { socialRadarChartOption } from '../../../Utils/chartsLogic/socialRadarChartOption'

const SocialMediaStatisticsChart = () => {
    const chartOptions = socialRadarChartOption()

    return (
        <div className="">
            <div className={`card`}>
                <div className="card-header">
                    <h3>Social Media Statistics</h3>
                </div>
                <div className="card-body">
                    <ReactApexChart
                        options={chartOptions}
                        series={chartOptions?.series}
                        type='radar'
                        height={450}
                    />
                </div>
                {/* <Link to="#" className="card-footer fs-11 fw-bold text-uppercase text-center">Explore Details</Link> */}
            </div>
            {/* <CardLoader refreshKey={refreshKey} /> */}
        </div>
    )
}

export default SocialMediaStatisticsChart