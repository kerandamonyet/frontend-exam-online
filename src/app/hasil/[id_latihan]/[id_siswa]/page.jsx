// File: app/hasil/[id_latihan]/[id_siswa]/page.jsx

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getHasilSiswa(idLatihan, idSiswa) {
  try {
    // Fetch data from the API endpoint using the provided route
    const response = await fetch(
      `http://localhost:5000/api/hasil/${idLatihan}/${idSiswa}`,
      {
        cache: "no-store", // Ensures fresh data on each request
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching hasil:", error);
    throw new Error("Failed to fetch hasil");
  }
}

export default async function HasilSiswaPage({ params }) {
  const { id_latihan, id_siswa } = params;

  // Fetch the hasil data
  const hasil = await getHasilSiswa(id_latihan, id_siswa);

  // If no data or error, show 404
  if (!hasil.success || hasil.error) {
    notFound();
  }

  const { data } = hasil;
  const tanggalLatihan = new Date(data.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const waktuLatihan = new Date(data.created_at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate percentage for progress bars
  const percentageBenar = (data.benar / data.total_soal) * 100;
  const percentageSalah = (data.salah / data.total_soal) * 100;

  // Function to get emoji and message based on score
  const getScoreEmoji = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 90) return { emoji: "🤩", message: "Hebat Sekali!" };
    if (numScore >= 80) return { emoji: "😄", message: "Bagus!" };
    if (numScore >= 70) return { emoji: "🙂", message: "Cukup Baik" };
    if (numScore >= 60) return { emoji: "😊", message: "Terus Belajar" };
    return { emoji: "🤔", message: "Belajar Lagi Ya" };
  };

  const scoreResult = getScoreEmoji(data.skor);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-blue-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white text-center">
            <h1 className="text-3xl font-bold mb-1">Hasil Latihan Kamu</h1>
          </div>

          {/* Result Card */}
          <div className="p-6">
            {/* Score Section with Emoji */}
            <div className="flex flex-col items-center justify-center mb-8 text-center">
              <div className="bg-blue-50 text-blue-600 rounded-full p-8 mb-4">
                <span className="text-6xl font-bold">
                  {parseFloat(data.skor).toFixed(0)}
                </span>
                <span className="text-2xl">%</span>
              </div>
              <div className="text-5xl mb-2">{scoreResult.emoji}</div>
              <h2 className="text-2xl font-bold text-blue-700">
                {scoreResult.message}
              </h2>
            </div>

            {/* Statistics in more fun layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border-2 rounded-xl p-4 bg-blue-50 border-blue-200 text-center transform transition-transform hover:scale-105">
                <h3 className="text-lg text-blue-600 mb-1 font-medium">
                  Soal yang dijawab
                </h3>
                <p className="text-4xl font-bold text-blue-700">
                  {data.total_soal}
                </p>
              </div>
              <div className="border-2 rounded-xl p-4 bg-green-50 border-green-200 text-center transform transition-transform hover:scale-105">
                <h3 className="text-lg text-green-600 mb-1 font-medium">
                  Jawaban Benar
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  {data.benar}
                </p>
              </div>
              <div className="border-2 rounded-xl p-4 bg-red-50 border-red-200 text-center transform transition-transform hover:scale-105">
                <h3 className="text-lg text-red-600 mb-1 font-medium">
                  Jawaban Salah
                </h3>
                <p className="text-4xl font-bold text-red-600">{data.salah}</p>
              </div>
            </div>

            {/* Progress Bars with more fun styling */}
            <div className="space-y-6 mb-10 bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-xl font-medium text-blue-700 mb-4 text-center">
                Persentase Jawaban
              </h3>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-base font-medium text-green-600">
                    Benar ({data.benar} soal)
                  </span>
                  <span className="text-base font-medium text-green-600">
                    {percentageBenar.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${percentageBenar}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-base font-medium text-red-600">
                    Salah ({data.salah} soal)
                  </span>
                  <span className="text-base font-medium text-red-600">
                    {percentageSalah.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-red-500 h-4 rounded-full"
                    style={{ width: `${percentageSalah}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Simplified for children */}
            <div className="flex flex-col gap-4">
              <Link
                href="/login-siswa"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl text-center font-medium hover:from-purple-600 hover:to-pink-600 transition-colors text-lg shadow-md"
              >
                Kembali ke Halaman Utama
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
