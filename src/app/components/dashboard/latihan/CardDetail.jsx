import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../../../../../utils/formatDate";
import { useParams } from "next/navigation";
import { getLatihanById } from "../../../../../lib/data";

function CardDetail() {
  const [latihan, setLatihan] = useState(null);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id_latihan = params?.id;

  // Fetch daftar kelas
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/kelas");
        setKelasList(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error("Error fetching kelas:", err);
        setKelasList([]);
      }
    };
    fetchKelas();
  }, []);

  // Fetch data latihan berdasarkan ID
  useEffect(() => {
    if (id_latihan) {
      const fetchLatihan = async () => {
        try {
          const data = await getLatihanById(id_latihan);
          setLatihan(data);
        } catch (error) {
          console.error("Error fetching latihan:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchLatihan();
    }
  }, [id_latihan]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  if (!latihan)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Data tidak ditemukan</p>
      </div>
    );

  const namaKelas =
    kelasList.find((k) => k.id === latihan.kelas_id)?.nama_kelas ||
    "Tidak Diketahui";

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
            {latihan.nama_latihan}
          </h2>
          <span className="text-sm font-medium text-blue-600 bg-blue-100 rounded-full px-3 py-1">
            ID: {latihan.id_latihan}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Kelas:</p>
            <p className="text-gray-800">{namaKelas}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Tipe Latihan:</p>
            <p className="text-gray-800">{latihan.tipe_latihan}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Durasi:</p>
            <p className="text-gray-800">{latihan.durasi} menit</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Tanggal Mulai:
            </p>
            <p className="text-gray-800">
              {latihan.tgl_mulai
                ? formatDate(latihan.tgl_mulai.toString())
                : "Tidak ada tanggal mulai"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Tanggal Selesai:
            </p>
            <p className="text-gray-800">
              {latihan.tgl_selesai
                ? formatDate(latihan.tgl_selesai.toString())
                : "Tidak ada tanggal selesai"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetail;
