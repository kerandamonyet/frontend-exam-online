import React, { useState, useEffect } from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { EditButton, DeleteButton, DetailButton } from "./Button";
import {
  getAllSesiLatihan,
  deleteSesiLatihan,
  getLatihan,
  getSiswa,
} from "../../../../../lib/data";

function SesiLatihanTable({ data, setData, currentPage, itemsPerPage }) {
  const [latihanList, setLatihanList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);

  useEffect(() => {
    const fetchLatihan = async () => {
      try {
        const { data } = await getLatihan();
        setLatihanList(data);
      } catch (error) {
        console.error("Gagal mengambil data latihan", error);
      }
    };

    const fetchSiswa = async () => {
      try {
        const { data } = await getSiswa();
        setSiswaList(data);
      } catch (error) {
        console.error("Gagal mengambil data siswa", error);
      }
    };

    fetchLatihan();
    fetchSiswa();
  }, []);

  const handleDelete = async () => {
    try {
      const { data } = await deleteSesiLatihan(currentPage, itemsPerPage);
      setData(data);
    } catch (error) {
      console.error("Gagal memperbarui data setelah penghapusan", error);
    }
  };

  // Function to render status with appropriate styling
  const renderStatus = (status) => {
    switch (status) {
      case "sedang_berlangsung":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Berlangsung
          </span>
        );
      case "selesai":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Selesai
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <table className="w-full text-xs text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="py-2 px-3">ID</th>
          <th className="py-2 px-3">Nama Latihan</th>
          <th className="py-2 px-3">Nama Siswa</th>
          <th className="py-2 px-3">Waktu Mulai</th>
          <th className="py-2 px-3">Waktu Selesai</th>
          <th className="py-2 px-3">Status</th>
          <th className="py-2 px-3">Created At</th>
          <th className="py-2 px-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((sesi_latihan) => {
            const namaLatihan =
              latihanList.find((l) => l.id_latihan === sesi_latihan.id_latihan)
                ?.nama_latihan || "Tidak Diketahui";
            const namaSiswa =
              siswaList.find((s) => s.id === sesi_latihan.id_siswa)
                ?.nama_siswa || "Tidak Diketahui";

            return (
              <tr
                key={sesi_latihan.id_sesi}
                className="border-b even:bg-white odd:bg-gray-100"
              >
                <td className="py-2 px-3 text-center">
                  {sesi_latihan.id_sesi}
                </td>
                <td className="py-2 px-3 text-center">{namaLatihan}</td>
                <td className="py-2 px-3">{namaSiswa}</td>
                <td className="py-2 px-3">
                  {sesi_latihan.waktu_mulai
                    ? formatDate(sesi_latihan.waktu_mulai.toString())
                    : "Tidak ada tanggal mulai"}
                </td>
                <td className="py-2 px-3">
                  {sesi_latihan.waktu_selesai
                    ? formatDate(sesi_latihan.waktu_selesai.toString())
                    : "Belum Selesai"}
                </td>
                <td className="py-2 px-3">
                  {renderStatus(sesi_latihan.status)}
                </td>
                <td className="py-2 px-3">
                  {sesi_latihan.created_at
                    ? formatDate(sesi_latihan.created_at.toString())
                    : "Tidak ada tanggal"}
                </td>
                <td className="flex justify-center gap-1 py-2 px-3">
                  <DeleteButton
                    id={sesi_latihan.id_sesi}
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

export default SesiLatihanTable;
