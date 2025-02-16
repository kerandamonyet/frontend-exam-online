import React, { useState, useEffect } from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { EditButton, DeleteButton } from "./Button";
import { getKelas, getSiswa, getRole } from "../../../../../lib/data";
import { formatDateNoTime } from "../../../../../utils/formatDateNotime";

function SiswaTable({ data, setData, currentPage, itemsPerPage }) {
  const [kelasList, setKelasList] = useState([]);
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const { data } = await getKelas();
        setKelasList(data);
      } catch (error) {
        console.error("Gagal mengambil data kelas", error);
      }
    };

    const fetchRole = async () => {
      try {
        const { data } = await getRole();
        setRoleList(data);
      } catch (error) {
        console.error("Gagal mengambil data role", error);
      }
    };

    fetchKelas();
    fetchRole();
  }, []);

  const fetchSiswaData = async () => {
    try {
      const { data } = await getSiswa(currentPage, itemsPerPage);
      setData(data);
    } catch (error) {
      console.error("Gagal memperbarui data siswa", error);
    }
  };

  return (
    <table className="w-full text-xs text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="py-2 px-3">ID</th>
          <th className="py-2 px-3">Username</th>
          <th className="py-2 px-3">Password</th>
          <th className="py-2 px-3">Nama</th>
          <th className="py-2 px-3">Kelas</th>
          <th className="py-2 px-3">Jenis Kelamin</th>
          <th className="py-2 px-3">Tanggal Lahir</th>
          <th className="py-2 px-3">Role</th>
          <th className="py-2 px-3">Created At</th>
          <th className="py-2 px-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((siswa) => {
            const namaKelas =
              kelasList.find((k) => k.id === siswa.kelas_id)?.nama_kelas ||
              "Tidak Diketahui";

            const namaRole =
              roleList.find((r) => r.role_id === siswa.role_id)?.role_name ||
              "Tidak Diketahui";

            return (
              <tr
                key={siswa.id}
                className="border-b even:bg-white odd:bg-gray-100"
              >
                <td className="py-2 px-3 text-center">{siswa.id}</td>
                <td className="py-2 px-3">{siswa.username}</td>
                <td className="py-2 px-3">{siswa.password}</td>
                <td className="py-2 px-3">{siswa.nama_siswa}</td>
                <td className="py-2 px-3">{namaKelas}</td>
                <td className="py-2 px-3">{siswa.jenis_kelamin}</td>
                <td className="py-2 px-3">
                  {siswa.tgl_lahir
                    ? formatDateNoTime(siswa.tgl_lahir.toString())
                    : "Tidak ada tanggal"}
                </td>
                <td className="py-2 px-3">{namaRole}</td>
                <td className="py-2 px-3">
                  {siswa.created_at
                    ? formatDate(siswa.created_at.toString())
                    : "Tidak ada tanggal"}
                </td>
                <td className="flex justify-center gap-1 py-2 px-3">
                  <EditButton siswa={siswa} onUpdate={fetchSiswaData} />
                  <DeleteButton id={siswa.id} onDelete={fetchSiswaData} />
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="10" className="text-center py-4">
              Tidak ada data siswa
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default SiswaTable;
