import React, { useState, useEffect } from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { EditButton, DeleteButton, DetailButton } from "./Button";
import {
  getAllHasilSiswa,
  getHasilByLatihan,
  getLatihan,
  getSiswa,
  getAllSesiLatihan,
} from "../../../../../lib/data";

function NilaiTable({ data, setData, currentPage, itemsPerPage }) {
  const [latihanList, setLatihanList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [percobaanList, setPercobaanList] = useState([]);

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

    const fetchPercobaan = async () => {
      try {
        const { data } = await getAllSesiLatihan();
        setPercobaanList(data);
      } catch (error) {
        console.error("Gagal mengambil data percobaan", error);
      }
    };

    fetchLatihan();
    fetchSiswa();
    fetchPercobaan();
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
          <th className="py-2 px-3">Nama Latihan</th>
          <th className="py-2 px-3 text-center">Total Soal</th>
          <th className="py-2 px-3 text-center">Benar</th>
          <th className="py-2 px-3 text-center">Salah</th>
          <th className="py-2 px-3 text-center">Soal dijawab</th>
          <th className="py-2 px-3 text-center">Skor</th>
          <th className="py-2 px-3 text-center">Percobaan</th>
          <th className="py-2 px-3">Created At</th>
          {/* <th className="py-2 px-3 text-center">Action</th> */}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((nilai, index) => {
            // Hitung nomor urut berdasarkan currentPage dan itemsPerPage
            const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
            const namaLatihan =
              latihanList.find((l) => l.id_latihan === nilai.latihan_id)
                ?.nama_latihan || "Tidak Diketahui";
            const namaSiswa =
              siswaList.find((s) => s.id === nilai.siswa_id)?.nama_siswa ||
              "Tidak Diketahui";
            const percobaan =
              percobaanList.find((p) => p.id === nilai.id_sesi)?.percobaan ||
              "Tidak Diketahui";

            return (
              <tr
                key={nilai.id}
                className="border-b even:bg-white odd:bg-gray-100"
              >
                <td className="py-2 px-3 text-center">{rowNumber}</td>
                <td className="py-2 px-3">{namaSiswa}</td>
                <td className="py-2 px-3">{namaLatihan}</td>
                <td className="py-2 px-3 text-center">30</td>
                <td className="py-2 px-3 text-center">{nilai.benar}</td>
                <td className="py-2 px-3 text-center">{nilai.salah}</td>
                <td className="py-2 px-3 text-center">{nilai.total_soal}</td>
                <td className="py-2 px-3 text-center font-bold">
                  {nilai.skor}
                </td>
                <td className="py-2 px-3 text-center font-bold">{percobaan}</td>
                <td className="py-2 px-3">
                  {nilai.created_at
                    ? formatDate(nilai.created_at.toString())
                    : "Tidak ada tanggal"}
                </td>
                {/* <td className="flex justify-center gap-1 py-2 px-3">
                  <DeleteButton id={nilai.id} onDelete={handleDelete} />
                </td> */}
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
