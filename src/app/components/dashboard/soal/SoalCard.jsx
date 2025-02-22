import React, { useState, useEffect } from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { getLatihan, getSoalByIdSoal } from "../../../../../lib/data";
import { EditButton, DeleteButton } from "./Button";

function SoalCard({ data, setData, currentPage, itemsPerPage }) {
  const [latihanList, setLatihanList] = useState([]);

  useEffect(() => {
    const fetchLatihan = async () => {
      try {
        const { data: latihanData } = await getLatihan();
        setLatihanList(latihanData);
      } catch (error) {
        console.error("Gagal mengambil data latihan", error);
      }
    };

    fetchLatihan();
  }, []);

  const handleDelete = async () => {
    try {
      const { data: soalData } = await getSoalByIdSoal(
        currentPage,
        itemsPerPage
      );
      setData(soalData);
    } catch (error) {
      console.error("Gagal memperbarui data setelah penghapusan", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data: soalData } = await getSoalByIdSoal(
        currentPage,
        itemsPerPage
      );
      setData(soalData);
    } catch (error) {
      console.error("Gagal memperbarui data setelah pembaruan", error);
    }
  };

  return (
    <div className="space-y-4">
      {data.length > 0 ? (
        data.map((soal) => {
          const namaLatihan =
            latihanList.find(
              (latihan) => latihan.id_latihan === soal.latihan_id
            )?.nama_latihan || "Tidak Diketahui";

          return (
            <div
              key={soal.id}
              className="w-full bg-white shadow-md rounded-md overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <span className="text-lg font-bold">{namaLatihan}</span>
                <span className="text-sm text-gray-600">ID soal: {soal.id}</span>
              </div>
              {/* Card Body */}
              <div className="p-4">
                <div className="mb-2">
                  <strong>Soal: </strong>
                  <span dangerouslySetInnerHTML={{ __html: soal.text_soal }} />
                </div>
                <div className="mb-2">
                  <strong>Options: </strong>
                  {Array.isArray(soal.options) ? (
                    <ul className="list-disc pl-4 ">
                      {soal.options.map((option, index) => {
                        const letter = String.fromCharCode(65 + index);
                        return (
                          <li key={index}>
                            <strong>{letter}. </strong>
                            <span
                              dangerouslySetInnerHTML={{ __html: option }}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: soal.options }} />
                  )}
                </div>
                <div className="mb-2">
                  <strong>Jawaban Benar: </strong>
                  <span
                    dangerouslySetInnerHTML={{ __html: soal.jawaban_benar }}
                  />
                </div>
              </div>
              {/* Card Footer */}
              <div className="p-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {soal.created_at
                    ? formatDate(soal.created_at.toString())
                    : "Tidak ada tanggal"}
                </span>
                {/* Jika diperlukan, action button bisa diaktifkan kembali */}
                <div className="flex gap-1">
                  <EditButton id={soal.id} onUpdate={handleUpdate} />
                  <DeleteButton id={soal.id} onDelete={handleDelete} />
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
