import React, { useState, useEffect } from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { EditButton, DeleteButton, DetailButton } from "./Button";
import { getLatihan, getKelas } from "../../../../../lib/data";

function LatihanTable({ data, setData, currentPage, itemsPerPage }) {
  const [kelasList, setKelasList] = useState([]);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const { data } = await getKelas();
        setKelasList(data);
      } catch (error) {
        console.error("Gagal mengambil data kelas", error);
      }
    };

    fetchKelas();
  }, []);

  const handleDelete = async () => {
    try {
      const { data } = await getLatihan(currentPage, itemsPerPage);
      setData(data);
    } catch (error) {
      console.error("Gagal memperbarui data setelah penghapusan", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await getLatihan(currentPage, itemsPerPage);
      setData(data);
    } catch (error) {
      console.error("Gagal memperbarui data setelah pembaruan", error);
    }
  };

  return (
    <table className="w-full text-xs text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="py-2 px-3">ID</th>
          <th className="py-2 px-3">Nama Latihan</th>
          <th className="py-2 px-3">Kelas</th>
          <th className="py-2 px-3">Tipe Latihan</th>
          <th className="py-2 px-3">Tgl Mulai</th>
          <th className="py-2 px-3">Tgl Selesai</th>
          <th className="py-2 px-3">Durasi</th>
          <th className="py-2 px-3">Created At</th>
          <th className="py-2 px-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((latihan) => {
            const namaKelas =
              kelasList.find((k) => k.id === latihan.kelas_id)?.nama_kelas ||
              "Tidak Diketahui";

            return (
              <tr
                key={latihan.id_latihan}
                className="border-b even:bg-white odd:bg-gray-100"
              >
                <td className="py-2 px-3 text-center">{latihan.id_latihan}</td>
                <td className="py-2 px-3 text-center">{latihan.nama_latihan}</td>
                <td className="py-2 px-3">{namaKelas}</td>
                <td className="py-2 px-3">{latihan.tipe_latihan}</td>
                <td className="py-2 px-3">
                  {latihan.tgl_mulai
                    ? formatDate(latihan.tgl_mulai.toString())
                    : "Tidak ada tanggal mulai"}
                </td>
                <td className="py-2 px-3">
                  {latihan.tgl_selesai
                    ? formatDate(latihan.tgl_selesai.toString())
                    : "Tidak ada tanggal akhir"}
                </td>
                <td className="py-2 px-3">{latihan.durasi} menit</td>
                <td className="py-2 px-3">
                  {latihan.created_at
                    ? formatDate(latihan.created_at.toString())
                    : "Tidak ada tanggal"}
                </td>
                <td className="flex justify-center gap-1 py-2 px-3">
                  <DetailButton id={latihan.id_latihan} />
                  <EditButton latihan={latihan} onUpdate={handleUpdate} />
                  <DeleteButton
                    id={latihan.id_latihan}
                    onDelete={handleDelete}
                  />
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="8" className="text-center py-4">
              Tidak ada data latihan
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default LatihanTable;
