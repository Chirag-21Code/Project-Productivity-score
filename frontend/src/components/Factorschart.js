import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FactorsChart = ({ factors }) => {

  if (!factors) return null;

  const labels = Object.keys(factors);
  const values = Object.values(factors);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Feature Contribution",
        data: values,
        backgroundColor: "rgba(75,192,192,0.6)"
      }
    ]
  };

  return (
    <div style={{ width: "600px", marginTop: "20px" }}>
      <Bar data={data} />
    </div>
  );
};

export default FactorsChart;