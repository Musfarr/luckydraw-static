import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({
  degree,
  backgroundColor,
  borderColor,
  graphData,
  graphlabels,
}) => {
  // Create a mapping of labels to colors for external use
  const labelColorMap = graphlabels.reduce((map, label, index) => {
    map[label] = backgroundColor[index % backgroundColor.length];
    return map;
  }, {});
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        // Set this to false to hide the built-in legend
        display: false
      },
      tooltip: {
        enabled: true
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
        data: graphData,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Pie options={options} data={data} />
      
      {/* Custom legend */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {graphlabels.map((label, index) => (
            <div key={label} style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
              <div 
                style={{ 
                  width: "10px", 
                  height: "10px", 
                  borderRadius: "50%", 
                  backgroundColor: backgroundColor[index % backgroundColor.length],
                  marginRight: "5px"
                }} 
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div>
          {graphData.map((value, index) => (
            <span key={index} style={{ marginLeft: "10px" }}>{value}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;