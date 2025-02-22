"use client";
import React, { useState, useEffect } from "react";
import { getLatihan } from "../../../../../lib/data";

function SortirByLatihan({ onFilter }) {
  const [latihanList, setLatihanList] = useState([]);

  // Ambil data latihan ketika komponen pertama kali di-render
  useEffect(() => {
    const fetchLatihan = async () => {
      try {
        const { data: latihanData } = await getLatihan();
        setLatihanList(latihanData);
      } catch (error) {
        console.error("Gagal mengambil data latihan", error);
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

      {/* Tampilkan daftar latihan sebagai pill */}
      {latihanList.map((latihan) => (
        <button
          key={latihan.id_latihan}
          onClick={() => onFilter(latihan.id_latihan)}
          className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm hover:bg-blue-200 transition cursor-pointer"
        >
          {latihan.nama_latihan}
        </button>
      ))}
    </div>
  );
}

export default SortirByLatihan;
