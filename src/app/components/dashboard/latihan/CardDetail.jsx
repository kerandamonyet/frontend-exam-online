"use client";

import React, { useState, useEffect } from "react";
import { getLatihanById } from "../../../../../lib/data";

const CardDetail = ({ id_latihan }) => {
  const [latihan, setLatihan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fungsi untuk memformat string tanggal menjadi tampilan lokal yang mudah dibaca
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  useEffect(() => {
    if (!id_latihan) {
      setError("ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    async function fetchLatihan() {
      try {
        const data = await getLatihanById(id_latihan);
        if (!data) {
          setError("Data latihan tidak ditemukan.");
        } else {
          setLatihan(data);
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    }
    fetchLatihan();
  }, [id_latihan]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!latihan) return <div>Data latihan tidak ditemukan.</div>;

  // Buat array detail untuk ditampilkan menggunakan map
  const details = [
    { label: "ID Latihan", value: latihan.id_latihan },
    { label: "Kelas", value: latihan.kelas },
    { label: "Tipe Latihan", value: latihan.tipe_latihan },
    { label: "Tanggal Mulai", value: formatDate(latihan.tgl_mulai) },
    { label: "Tanggal Selesai", value: formatDate(latihan.tgl_selesai) },
    { label: "Durasi", value: latihan.durasi + " menit" },
    { label: "Dibuat", value: formatDate(latihan.created_at) },
  ];

  return (
    <div className="card rounded-md shadow-lg p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Detail Latihan</h2>
      {details.map((item, index) => (
        <div key={index} className="mb-2">
          <span className="font-semibold">{item.label}: </span>
          {item.value}
        </div>
      ))}
    </div>
  );
};

export default CardDetail;
