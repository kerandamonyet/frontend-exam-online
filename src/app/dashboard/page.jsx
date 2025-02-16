"use client";
import React, { useState, useEffect } from "react";
import BtnLogout from "../components/BtnLogout";
import AuthGuard from "../components/AuthGuard";
import StatCard from "../components/dashboard/StatCard";
import LineChart from "../components/dashboard/LineChart";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaHome,
  FaSchool,
} from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";

const DashboardGuru = () => {
  const [stats, setStats] = useState({
    totalGuru: 0,
    totalSiswa: 0,
    totalKelas: 0,
    totalLatihan: 0,
  });
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats/total");

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          setStats({
            totalGuru: data.data.total_guru,
            totalSiswa: data.data.total_siswa,
            totalKelas: data.data.total_kelas,
            totalLatihan: data.data.total_latihan,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    const fetchChartData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats/monthly");

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          setChartData({
            labels: data.data.months,
            datasets: [
              {
                label: "Total Guru",
                data: data.data.total_guru,
                borderColor: "rgba(54, 162, 235, 1)", // Biru
                backgroundColor: "rgba(54, 162, 235, 0.2)",
              },
              {
                label: "Total Siswa",
                data: data.data.total_siswa,
                borderColor: "rgba(75, 192, 192, 1)", // Hijau
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
              {
                label: "Total Kelas",
                data: data.data.total_kelas,
                borderColor: "rgba(255, 206, 86, 1)", // Kuning
                backgroundColor: "rgba(255, 206, 86, 0.2)",
              },
              {
                label: "Total Latihan",
                data: data.data.total_latihan,
                borderColor: "rgba(255, 99, 132, 1)", // Merah
                backgroundColor: "rgba(255, 99, 132, 0.2)",
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchStats(), fetchChartData()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col lg:flex-row min-h-screen">
        <main className="flex-1 p-6 bg-gray-50">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaHome className="text-blue-500 mr-2" /> Dashboard Guru
            </h1>
            <BtnLogout />
          </header>

          {/* Statistik Total */}
          <section className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <p className="text-gray-700 text-lg font-medium mb-4">
              Selamat datang di Dashboard Guru!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Guru"
                total={stats.totalGuru}
                Icon={FaChalkboardTeacher}
                detailLink="/dashboard/guru"
                bgColor="bg-blue-100"
              />
              <StatCard
                title="Total Siswa"
                total={stats.totalSiswa}
                Icon={FaUserGraduate}
                detailLink="/dashboard/siswa"
                bgColor="bg-green-100"
              />
              <StatCard
                title="Total Kelas"
                total={stats.totalKelas}
                Icon={FaSchool}
                detailLink="/dashboard/kelas"
                bgColor="bg-yellow-100"
              />
              <StatCard
                title="Total Latihan"
                total={stats.totalLatihan}
                Icon={MdOutlineQuiz}
                detailLink="/dashboard/latihan"
                bgColor="bg-purple-100"
              />
            </div>
          </section>

          {/* Grafik Garis (Data Dinamis) */}
          {chartData && (
            <section className="bg-white p-6 rounded-lg shadow">
              <LineChart data={chartData} />
            </section>
          )}
        </main>
      </div>
    </AuthGuard>
  );
};

export default DashboardGuru;
