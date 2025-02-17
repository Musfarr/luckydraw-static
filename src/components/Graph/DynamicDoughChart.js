import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = Math.floor((i * 360) / numColors);
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const DynamicDoughnutChart = ({ degree, graphData, graphLabels, colors }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Doughnut Chart",
      },
    },
  };

  // const data = {
  //   labels: graphLabels || ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //   datasets: graphData.map((data, index) => {
  //     const colors = generateColors(data.length);
  //     return {
  //       label: `Dataset ${index + 1}`,
  //       data: data,
  //       backgroundColor: colors,
  //       borderColor: colors,
  //       borderWidth: 1,
  //       cutout: "90%",
  //       circumference: degree,
  //       rotation: 270,
  //     };
  //   }),
  // };
  const data = {
    labels: graphLabels || [
      "Red",
      "Blue",
      "Yellow",
      "Green",
      "Purple",
      "Orange",
    ],
    // datasets: graphData.map((data, index) => ({
    //   // label: `Dataset ${index + 1}`,
    //   data: data,
    //   backgroundColor: colors,
    //   borderColor: colors,
    //   borderWidth: 1,
    //   cutout: "90%",
    //   circumference: degree,
    //   rotation: 270,
    // })),
    datasets: [
      {
        data: graphData,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        cutout: "90%",
        circumference: degree,
        rotation: 270,
      },
    ],
  };

  return (
    <div>
      <Doughnut options={options} data={data} />
    </div>
  );
};

export default DynamicDoughnutChart;
