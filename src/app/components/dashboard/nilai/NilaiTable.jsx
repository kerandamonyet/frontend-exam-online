import React, { useState, useEffect } from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { EditButton, DeleteButton, DetailButton } from "./Button";
import {
  getAllHasilSiswa,
  getHasilByLatihan,
  getLatihan,
  getSiswa,
  getSesiLatihan,
  getKelas,
} from "../../../../../lib/data";

function NilaiTable({ data, setData, currentPage, itemsPerPage }) {
  const [latihanList, setLatihanList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // default urut dari tertinggi
  const [timeSortOrder, setTimeSortOrder] = useState("desc");

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
    const fetchKelas = async () => {
      try {
        const { data } = await getKelas();
        setKelasList(data);
      } catch (error) {
        console.error("Gagal mengambil data kelas", error);
      }
    };

    fetchLatihan();
    fetchSiswa();
    fetchKelas();
  }, []);

  const handleDelete = async () => {
    try {
      const { data } = await getAllHasilSiswa(currentPage, itemsPerPage);
      setData(data);
    } catch (error) {
      console.error("Gagal memperbarui data setelah penghapusan", error);
    }
  };

  return (
    <table className="w-full text-xs text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="py-2 px-3">No</th>
          <th className="py-2 px-3">Nama Siswa</th>
          <th className="py-2 px-3">Kelas</th>
          <th className="py-2 px-3">Nama Latihan</th>
          <th className="py-2 px-3 text-center">Total Soal</th>
          <th className="py-2 px-3 text-center">Benar</th>
          <th className="py-2 px-3 text-center">Salah</th>
          <th
            className="py-2 px-3 text-center cursor-pointer"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Skor
            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
          </th>
          <th className="py-2 px-3 text-center">Percobaan</th>
          <th
            className="py-2 px-3 cursor-pointer"
            onClick={() =>
              setTimeSortOrder(timeSortOrder === "asc" ? "desc" : "asc")
            }
          >
            Created At
            <span className="ml-1">{timeSortOrder === "asc" ? "↑" : "↓"}</span>
          </th>
          {/* <th className="py-2 px-3 text-center">Action</th> */}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          [...data]
            .sort((a, b) => {
              const dateA = new Date(a.created_at);
              const dateB = new Date(b.created_at);
              return timeSortOrder === "asc" ? dateA - dateB : dateB - dateA;
            })

            .map((nilai, index) => {
              const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
              const namaLatihan =
                latihanList.find((l) => l.id_latihan === nilai.latihan_id)
                  ?.nama_latihan || "Tidak Diketahui";
              const siswa = siswaList.find((s) => s.id === nilai.siswa_id);
              const namaSiswa = siswa?.nama_siswa || "Tidak Diketahui";
              const kelas = kelasList.find((k) => k.id === siswa?.kelas_id);
              const namaKelas = kelas?.nama_kelas || "Tidak Diketahui";

              return (
                <tr
                  key={nilai.id}
                  className="border-b even:bg-white odd:bg-gray-100"
                >
                  <td className="py-2 px-3 text-center">{rowNumber}</td>
                  <td className="py-2 px-3">{namaSiswa}</td>
                  <td className="py-2 px-3 text-center">{namaKelas}</td>
                  <td className="py-2 px-3">{namaLatihan}</td>
                  <td className="py-2 px-3 text-center">20</td>
                  <td className="py-2 px-3 text-center">{nilai.benar}</td>
                  <td className="py-2 px-3 text-center">{nilai.salah}</td>
                  <td className="py-2 px-3 text-center font-bold">
                    {nilai.skor}
                  </td>
                  <td className="py-2 px-3 text-center font-bold">
                    {nilai.percobaan}
                  </td>
                  <td className="py-2 px-3">
                    {nilai.created_at
                      ? formatDate(nilai.created_at.toString())
                      : "Tidak ada tanggal"}
                  </td>
                </tr>
              );
            })
        ) : (
          <tr>
            <td colSpan="9" className="text-center py-4">
              Tidak ada data latihan
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default NilaiTable;
