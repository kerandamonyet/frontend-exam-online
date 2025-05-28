"use client";
import React, { useState, useEffect } from "react";
import { getLatihan } from "../../../../../lib/data";

function SortirByLatihan({ onFilter }) {
  const [latihanList, setLatihanList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatihan = async () => {
      try {
        setLoading(true);
        const { data: latihanData } = await getLatihan();

        if (!latihanData || latihanData.length === 0) {
          setError("Tidak ada data latihan.");
          setLatihanList([]);
        } else {
          // Urutkan berdasarkan created_at terbaru
          const sortedData = latihanData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setLatihanList(sortedData);
          setError(null);
        }
      } catch (err) {
        console.error("Gagal mengambil data latihan", err);
        setError("Gagal mengambil data latihan.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatihan();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {loading ? (
        <div className="text-gray-500 text-sm px-3 py-1">Memuat data...</div>
      ) : error ? (
        <div className="text-red-500 text-sm px-3 py-1">{error}</div>
      ) : (
        <>
          {/* Tombol reset filter */}
          <button
            onClick={() => onFilter(null)}
            className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm hover:bg-blue-200 transition cursor-pointer"
          >
            All
          </button>

          {/* Daftar latihan */}
          {latihanList.map((latihan) => (
            <button
              key={latihan.id_latihan}
              onClick={() => onFilter(latihan.id_latihan)}
              className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm hover:bg-blue-200 transition cursor-pointer"
            >
              {latihan.nama_latihan}
            </button>
          ))}
        </>
      )}
    </div>
  );
}

export default SortirByLatihan;
