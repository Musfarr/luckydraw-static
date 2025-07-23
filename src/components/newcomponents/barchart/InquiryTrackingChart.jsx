import React from 'react'
// import CardHeader from '@/components/shared/CardHeader'
import ReactApexChart from 'react-apexcharts'
import { inquiryTrackingChartOption } from '../../../Utils/chartsLogic/inquiryTrackingChartOption'

const InquiryTrackingChart = () => {
    const chartOption = inquiryTrackingChartOption()
    return (
            <div className="card ">
                {/* <CardHeader title={"Inquiry Tracking"} /> */}

                <div className='card-header'>
                    <h3>Inquiry Tracking</h3>
                </div>


                <div className="card-body custom-card-action">
                    <ReactApexChart
                        type='bar'
                        options={chartOption}
                        series={chartOption?.series}
                        height={450}
                    />
                </div>
            </div>
    )
}

export default InquiryTrackingChart