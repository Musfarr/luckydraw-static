import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({
  degree,
  backgroudColor,
  borderColor,
  graphData,
  graphlabels,
}) => {
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

  const data = {
    labels: graphlabels || [
      "Red",
      "Blue",
      "Yellow",
      "Green",
      "Purple",
      "Orange",
    ],
    datasets: [
      {
        // label: "# of Votes",
        data: graphData,
        backgroundColor: backgroudColor,
        // borderColor: borderColor,
        borderWidth: 1,
        // cutout: "90%",
        // circumference: degree,
        // rotation: 270,
      },
    ],
  };

  

  return (
    <div>
      <Pie options ={options}data={data} />
    </div>
  );
};

export default PieChart;
