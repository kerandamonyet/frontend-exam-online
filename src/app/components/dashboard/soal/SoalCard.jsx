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

  // Function to render appropriate content based on question type
  const renderQuestionContent = (soal) => {
    if (soal.tipe_soal === "pilihan_ganda") {
      // For multiple choice questions
      const options = [soal.opsi_a, soal.opsi_b, soal.opsi_c, soal.opsi_d];

      return (
        <>
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
            <span dangerouslySetInnerHTML={{ __html: soal.jawaban_benar }} />
          </div>
        </>
      );
    } else if (soal.tipe_soal === "tarik_garis") {
      // For line matching questions
      const dataTarikGaris = soal.data_tarik_garis || {};
      const opsiKiri = dataTarikGaris.opsi_kiri || [];
      const opsiKanan = dataTarikGaris.opsi_kanan || [];
      const jawabanBenar = dataTarikGaris.jawaban_benar || {};

      return (
        <>
          <div className="mb-2">
            <strong>Soal: </strong>
            <span dangerouslySetInnerHTML={{ __html: soal.text_soal }} />
          </div>
          <div className="mb-4">
            <strong>Pasangan Tarik Garis: </strong>
            <div className="mt-2 border rounded-md p-3 bg-gray-50">
              <div className="grid grid-cols-5 gap-4 mb-2 font-semibold">
                <div className="col-span-2">Opsi Kiri</div>
                <div className="col-span-1 text-center">→</div>
                <div className="col-span-2">Opsi Kanan</div>
              </div>
              {opsiKiri.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-4 py-1 border-b last:border-0"
                >
                  <div className="col-span-2">{item}</div>
                  <div className="col-span-1 text-center">→</div>
                  <div className="col-span-2">{jawabanBenar[item] || "-"}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    } else if (soal.tipe_soal === "drag_drop") {
      // For drag and drop questions
      const items = soal.items || [];

      return (
        <>
          <div className="mb-2">
            <strong>Soal: </strong>
            <span dangerouslySetInnerHTML={{ __html: soal.text_soal }} />
          </div>
          <div className="mb-2">
            <strong>Items: </strong>
            <ul className="list-disc pl-4">
              {items.map((item, index) => (
                <li key={index}>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
        </>
      );
    } else {
      // Default case
      return (
        <div className="mb-2">
          <strong>Soal: </strong>
          <span dangerouslySetInnerHTML={{ __html: soal.text_soal }} />
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-4">Memuat data...</div>
      ) : data?.length > 0 ? (
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
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold">{namaLatihan}</span>
                  <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {soal.tipe_soal === "pilihan_ganda"
                      ? "Pilihan Ganda"
                      : soal.tipe_soal === "tarik_garis"
                      ? "Tarik Garis"
                      : soal.tipe_soal === "drag_drop"
                      ? "Drag & Drop"
                      : soal.tipe_soal}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  ID soal: {soal.id}
                </span>
              </div>
              <div className="p-4">{renderQuestionContent(soal)}</div>
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
