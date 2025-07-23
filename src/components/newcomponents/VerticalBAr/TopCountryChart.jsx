import React, { Fragment } from 'react'
import ReactApexChart from 'react-apexcharts'
import { topCountryBarChartOptions } from '../../../Utils/chartsLogic/topCountryBarChartOptions'

const countryStatsData = [
    { country: 'Karachi', clicks: '2,258' },
    { country: 'Lahore', clicks: '2,025' },
    { country: 'Islamabad', clicks: '1,836' },
    { country: 'Faisalabad', clicks: '1,836' },
    { country: 'Faisalabad', clicks: '1,836' },
];

const TopCountryChart = () => {
    const chartOptions = topCountryBarChartOptions()

    return (
        <div className="col-xxl-4">
            <div className={`card stretch stretch-full leads-overview`}>
                <div className="card-header">
                    <h5 className="card-title">Top Cities</h5>
                </div>
                <div className="card-body">
                <div className="card-body custom-card-action p-0">
                    <ReactApexChart
                        type='bar'
                        options={chartOptions}
                        series={chartOptions.series}
                        height={350}
                    />
                </div>
                    {countryStatsData.map(({ clicks, country }, index) => (
                        <Fragment key={index}>
                            <hr className="border-dashed mt-1 mb-3" />
                            <div className="hstack justify-content-between">
                                <div className="hstack">
                                    {/* <div className="me-3" >
                                        <img src={flag} alt='img' className='w-full rounded-0' style={{ height: "15px", width: "20px" }} />
                                    </div> */}
                                    <span>{country}</span>
                                </div>
                                <div className=" fw-medium  text-muted">{clicks} Clicks</div>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TopCountryChart
