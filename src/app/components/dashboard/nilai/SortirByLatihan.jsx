"use client";
import React, { useState, useEffect } from "react";
import { getLatihan } from "../../../../../lib/data";

function SortirByLatihan({ onFilter }) {
  const [latihanList, setLatihanList] = useState([]);
  const [error, setError] = useState(null);

  // Ambil data latihan ketika komponen pertama kali di-render
  useEffect(() => {
    const fetchLatihan = async () => {
      try {
        const { data: latihanData } = await getLatihan();
        if (!latihanData || latihanData.length === 0) {
          setError("Tidak ada data latihan");
          setLatihanList([]);
        } else {
          setLatihanList(latihanData);
          setError(null);
        }
      } catch (error) {
        console.error("Gagal mengambil data latihan", error);
        setError("Gagal mengambil data latihan");
      }
    };

    fetchLatihan();
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      {/* Tombol untuk menampilkan semua soal (reset filter) */}
      <button
        onClick={() => onFilter(null)}
        className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm hover:bg-blue-200 transition cursor-pointer"
      >
        All
      </button>

      {/* Jika terdapat error, tampilkan pesan error */}
      {error ? (
        <div className="px-3 py-1 text-red-500 text-sm">{error}</div>
      ) : (
        // Tampilkan daftar latihan sebagai pill
        latihanList.map((latihan) => (
          <button
            key={latihan.id_latihan}
            onClick={() => onFilter(latihan.id_latihan)}
            className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm hover:bg-blue-200 transition cursor-pointer"
          >
            {latihan.nama_latihan}
          </button>
        ))
      )}
    </div>
  );
}

export default SortirByLatihan;
