import React, { useState, useEffect } from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { EditButton, DeleteButton } from "./Button";
import { getKelas, getGuru } from "../../../../../lib/data"; // Pastikan ada fungsi getGuru
import { formatDateNoTime } from "../../../../../utils/formatDateNotime";

function KelasTable({ data, setData, currentPage, itemsPerPage }) {
  const [guruList, setGuruList] = useState([]);

  useEffect(() => {
    // Ambil data guru saat komponen dimount
    const fetchGuru = async () => {
      try {
        const { data } = await getGuru();
        setGuruList(data); // Simpan daftar guru
      } catch (error) {
        console.error("Gagal mengambil data guru", error);
      }
    };

    fetchGuru();
  }, []);

  const handleDelete = async () => {
    try {
      const { data } = await getKelas(currentPage, itemsPerPage);
      setData(data);
    } catch (error) {
      console.error("Gagal memperbarui data setelah penghapusan", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await getKelas(currentPage, itemsPerPage);
      setData(data);
    } catch (error) {
      console.error("Gagal memperbarui data setelah penghapusan", error);
    }
  };

  return (
    <table className="w-full text-xs text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="py-2 px-3">ID</th>
          <th className="py-2 px-3">Nama Kelas</th>
          <th className="py-2 px-3">Tingkat</th>
          <th className="py-2 px-3">Wali Kelas</th>
          <th className="py-2 px-3">Created At</th>
          <th className="py-2 px-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((kelas) => {
            // Cari nama_guru berdasarkan guru_id
            const namaGuru =
              guruList.find((g) => g.id === kelas.guru_id)?.nama_guru ||
              "Tidak Diketahui";

            return (
              <tr
                key={kelas.id}
                className="border-b even:bg-white odd:bg-gray-100"
              >
                <td className="py-2 px-3 text-center">{kelas.id}</td>
                <td className="py-2 px-3">{kelas.nama_kelas}</td>
                <td className="py-2 px-3">{kelas.tingkat}</td>
                <td className="py-2 px-3">{namaGuru}</td>
                <td className="py-2 px-3">
                  {kelas.created_at
                    ? formatDate(kelas.created_at.toString())
                    : "Tidak ada tanggal"}
                </td>
                <td className="flex justify-center gap-1 py-2 px-3">
                  <EditButton kelas={kelas} onUpdate={handleUpdate} />
                  <DeleteButton id={kelas.id} onDelete={handleDelete} />
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="10" className="text-center py-4">
              Tidak ada data kelas
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default KelasTable;
