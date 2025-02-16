"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLatihanById } from "../../../../../../lib/data";
import { formatDate } from "../../../../../../utils/formatDate";
import SoalTable from "@/app/components/dashboard/kelas/SoalTable";
import AuthGuard from "@/app/components/AuthGuard";

function DetailPage() {
  // Mengambil parameter dari URL.
  // Jika Anda ingin parameter memiliki nama "id_latihan", Anda dapat mengubah nama folder dinamis menjadi [id_latihan]
  // atau cukup gunakan "id" sebagai alias dari id_latihan.
  const { id } = useParams();
  const id_latihan = id; // Asumsikan nilai id yang didapat adalah id_latihan

  const [latihan, setLatihan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id_latihan) {
      fetchLatihan(id_latihan);
    }
  }, [id_latihan]);

  const fetchLatihan = async (id_latihan) => {
    try {
      // Fungsi getLatihanById sudah mengembalikan data latihan jika sukses.
      const data = await getLatihanById(id_latihan);
      setLatihan(data);
    } catch (error) {
      console.error("Error fetching latihan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h1>Loading...</h1>;
  if (!latihan) return <h1>Data tidak ditemukan</h1>;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-4">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Latihan</h1>
          </header>

          {/* Card Detail Latihan */}
          <section className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 gap-4">
            {/* Grid untuk menampilkan detail latihan */}
            <div className=" card shadow-lg bordered-md p-5 rounded-md">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Detail Latihan
              </h2>
              <div className="grid grid-cols-2 gap-4 xs:grid-cols-1 ">
                <div>
                  <p className="font-semibold text-gray-600">ID:</p>
                  <p className="text-gray-800">{latihan.id_latihan}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Kelas:</p>
                  <p className="text-gray-800">{latihan.kelas}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Tipe Latihan:</p>
                  <p className="text-gray-800">{latihan.tipe_latihan}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Tanggal Mulai:</p>
                  <p className="text-gray-800">
                    {latihan.tgl_mulai
                      ? formatDate(latihan.tgl_mulai.toString())
                      : "Tidak ada tanggal mulai"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">
                    Tanggal Selesai:
                  </p>
                  <p className="text-gray-800">
                    {latihan.tgl_selesai
                      ? formatDate(latihan.tgl_selesai.toString())
                      : "Tidak ada tanggal selesai"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Durasi:</p>
                  <p className="text-gray-800">{latihan.durasi} menit</p>
                </div>
              </div>
            </div>

            {/* soal komponen */}
            <div className="mt-8 grid grid-rows-1 gap-4 card shadow-lg bordered-md p-5 rounded-md ">
              <div className="flex flex-1 justify-between">
                <h3>Soal</h3>
                <button>create</button>
              </div>
              <SoalTable />
              <SoalTable />
              <SoalTable />
            </div>
          </section>
        </div>
      </div>
    </AuthGuard>
  );
}

export default DetailPage;
