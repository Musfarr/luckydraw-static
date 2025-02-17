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

const DynamicLineChart = ({
  datasets,
  graphLabels,
  labelsForHover,
  colors,
}) => {
  // console.log(datasets);
  // console.log(graphLabels);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
  };

  const labels = graphLabels || [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: datasets?.map((dataset, index) => ({
      label: labelsForHover!==undefined ? labelsForHover[index]:"Dataset 1",
      // label: graphLabels[0],
      // borderColor: `hsl(${index * 50}, 70%, 50%)`,
      // backgroundColor: `hsla(${index * 50}, 70%, 50%, 0.5)`,
      borderColor: colors[index],
      backgroundColor: colors[index],
      data: dataset,
    })),
  };

  return <Line options={options} data={data} />;
};

export default DynamicLineChart;
