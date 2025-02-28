import React, { useState, useEffect, useCallback } from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { getLatihan, getSoalByIdSoal } from "../../../../../lib/data";
import { EditButton, DeleteButton } from "./Button";

function SoalCard({ data = [], setData, currentPage, itemsPerPage }) {
  const [latihanList, setLatihanList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLatihan = useCallback(async () => {
    try {
      const { data: latihanData } = await getLatihan();
      // Asumsikan data latihan memiliki properti "id" dan "nama_latihan"
      setLatihanList(latihanData || []);
    } catch (error) {
      console.error("Gagal mengambil data latihan:", error);
    }
  }, []);

  useEffect(() => {
    fetchLatihan();
  }, [fetchLatihan]);

  const fetchSoal = async () => {
    try {
      setLoading(true);
      const { data: soalData } = await getSoalByIdSoal(
        currentPage,
        itemsPerPage
      );
      setData(soalData || []);
    } catch (error) {
      console.error("Gagal memperbarui data soal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoal();
  }, [currentPage, itemsPerPage]);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-4">Memuat data...</div>
      ) : data?.length > 0 ? (
        data.map((soal) => {
          // Sesuaikan pencocokan latihan, asumsikan latihan.id ada dan cocok dengan soal.latihan_id
          const namaLatihan =
            latihanList.find((latihan) => latihan.id_latihan === soal.latihan_id)
              ?.nama_latihan || "Tidak Diketahui";

          // Buat array options dari field opsi_a sampai opsi_d
          const options = [soal.opsi_a, soal.opsi_b, soal.opsi_c, soal.opsi_d];

          return (
            <div
              key={soal.id}
              className="w-full bg-white shadow-md rounded-md overflow-hidden"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <span className="text-lg font-bold">{namaLatihan}</span>
                <span className="text-sm text-gray-600">
                  ID soal: {soal.id}
                </span>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <strong>Soal: </strong>
                  <span dangerouslySetInnerHTML={{ __html: soal.text_soal }} />
                </div>
                <div className="mb-2">
                  <strong>Options: </strong>
                  <ul className="list-disc pl-4">
                    {options.map((option, index) => (
                      <li key={index}>
                        <strong>{String.fromCharCode(65 + index)}. </strong>
                        <span dangerouslySetInnerHTML={{ __html: option }} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <strong>Jawaban Benar: </strong>
                  <span
                    dangerouslySetInnerHTML={{ __html: soal.jawaban_benar }}
                  />
                </div>
              </div>
              <div className="p-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {soal.created_at
                    ? formatDate(soal.created_at.toString())
                    : "Tidak ada tanggal"}
                </span>
                <div className="flex gap-1">
                  <EditButton id={soal.id} onUpdate={fetchSoal} />
                  <DeleteButton id={soal.id} onDelete={fetchSoal} />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-4">Tidak ada data soal</div>
      )}
    </div>
  );
}

export default SoalCard;
