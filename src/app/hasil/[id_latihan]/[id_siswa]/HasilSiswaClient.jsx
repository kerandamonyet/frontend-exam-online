"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";

export default function HasilSiswaClient({ data }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  // Tanggal & waktu sekarang
  const now = new Date();
  const tanggalSekarang = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const waktuSekarang = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleLogout = async () => {
    setPending(true);
    try {
      Cookies.remove("auth-token");
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Logout berhasil!",
      });

      sessionStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        icon: "error",
        title: "Logout Gagal",
        text: "Terjadi kesalahan, coba lagi nanti.",
      });
    } finally {
      setPending(false);
    }
  };

  const tanggalLatihan = new Date(data.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const waktuLatihan = new Date(data.created_at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const percentageBenar = (data.benar / data.total_soal) * 100;
  const percentageSalah = (data.salah / data.total_soal) * 100;

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
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white text-center">
            <h1 className="text-3xl font-bold mb-1">Hasil Latihan Kamu</h1>
            <p className="text-sm mt-2">
              ⏰ {waktuSekarang} | 📅 {tanggalSekarang}
            </p>
          </div>

          <div className="p-6">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border-2 rounded-xl p-4 bg-blue-50 border-blue-200 text-center">
                <h3 className="text-lg text-blue-600 mb-1 font-medium">
                  Total Soal
                </h3>
                <p className="text-4xl font-bold text-blue-700">
                  {data.total_soal}
                </p>
              </div>
              <div className="border-2 rounded-xl p-4 bg-green-50 border-green-200 text-center">
                <h3 className="text-lg text-green-600 mb-1 font-medium">
                  Jawaban Benar
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  {data.benar}
                </p>
              </div>
              <div className="border-2 rounded-xl p-4 bg-red-50 border-red-200 text-center">
                <h3 className="text-lg text-red-600 mb-1 font-medium">
                  Jawaban Salah
                </h3>
                <p className="text-4xl font-bold text-red-600">{data.salah}</p>
              </div>
            </div>

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

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLogout}
                disabled={pending}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl text-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors shadow-md"
              >
                <BiLogOut size={24} />
                {pending
                  ? "Kembali ke Halaman Utama..."
                  : "Kembali ke Halaman Utama"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
