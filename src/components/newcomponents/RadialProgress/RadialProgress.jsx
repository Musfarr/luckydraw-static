import React from 'react'
import ReactApexChart from 'react-apexcharts'

const RadialProgress = () => {
  const options = {
    series: [67], // Set your percent value here
    chart: {
      type: 'radialBar',
      offsetY: 0,
      sparkline: { enabled: false },
    },
    plotOptions: {
      radialBar: {

        track: {
          background: '#555', // Gray background arc
          strokeWidth: '100%',
          margin: 5, // gap between track and bar
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 8,
            fontSize: '32px',
            fontWeight: 500,
            color: '#222',
            formatter: function (val) {
              return `${val}%`;
            },
          },
        },
        hollow: {
          margin: 0,
          size: '65%',
          background: 'transparent',
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#6ee7f9'], // blue
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: "#22d47b", opacity: 1 },   // green
          { offset: 100, color: "#6ee7f9", opacity: 1 }, // blue
        ]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Progress'],
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">Calls Consumption</h5>
      </div>
      <div className="card-body">
        <ReactApexChart
          type='radialBar'
          options={options}
          series={options.series}
          height={400}
        />
      </div>
      <div className="card p-2 uk-text-center ">
        <h6 className="">Monthly Calls Consumed </h6>
      </div>
    </div>
  )
}

export default RadialProgress