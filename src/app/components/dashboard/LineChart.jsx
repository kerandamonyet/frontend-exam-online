"use client";
import React from "react";
import { Line } from "react-chartjs-2";
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

// Registrasi modul Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg shadow">
        <p className="text-gray-500">Data grafik tidak tersedia</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12 },
          boxWidth: 10,
        },
      },
      title: {
        display: true,
        text: "Grafik Perkembangan Guru, Siswa, Kelas, dan Latihan",
        font: { size: 16 },
        color: "#333",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    elements: {
      line: { borderWidth: 2, tension: 0.4 },
      point: { radius: 5, hoverRadius: 7 },
    },
    scales: {
      x: {
        grid: { display: true, color: "#ddd" },
        ticks: { font: { size: 12 } },
      },
      y: {
        grid: { display: true, color: "#ddd" },
        ticks: {
          font: { size: 12 },
          beginAtZero: true,
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
