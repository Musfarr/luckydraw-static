import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ dataValues, label, Title }) => {



  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        display: true,
      },
      title: {
        display: true,
        text: Title,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: true,
        },
      },
      y: {
        grid: {
          display: true,
          drawBorder: true,
        },
        beginAtZero: true,
      },
    },
  };

  const labels = label || [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels: labels,
    datasets: dataValues|| [
      
    ],
  };

  return <Line options={options} data={data} />;
};

export default LineChart;
