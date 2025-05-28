import React, { useState, useEffect, useCallback } from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { getLatihan } from "../../../../../lib/data";
import { EditButton, DeleteButton } from "./Button";

function SoalCard({ data = [], setData, currentPage, itemsPerPage, loading }) {
  const [latihanList, setLatihanList] = useState([]);

  const fetchLatihan = useCallback(async () => {
    try {
      const { data: latihanData } = await getLatihan();
      setLatihanList(latihanData || []);
    } catch (err) {
      console.error("Gagal mengambil data latihan:", err);
    }
  }, []);

  useEffect(() => {
    fetchLatihan();
  }, [fetchLatihan]);

  const grouped = {};
  data.forEach((soal) => {
    if (!grouped[soal.latihan_id]) grouped[soal.latihan_id] = [];
    grouped[soal.latihan_id].push(soal);
  });

  Object.values(grouped).forEach((arr) => {
    arr.forEach((soal, idx) => {
      soal.nomorSoal = idx + 1;
    });
  });

  const renderHTML = (htmlString) => (
    <span dangerouslySetInnerHTML={{ __html: htmlString }} />
  );

  const renderQuestionContent = (soal) => {
    return (
      <div>
        <p className="font-medium">
          <span className="font-bold">Soal {soal.nomorSoal}.</span>{" "}
          {renderHTML(soal.text_soal)}
        </p>
        <ul className="mt-1 ml-4 list-disc text-sm text-gray-700 space-y-1">
          <li>
            <strong>A.</strong> {renderHTML(soal.opsi_a)}
          </li>
          <li>
            <strong>B.</strong> {renderHTML(soal.opsi_b)}
          </li>
          <li>
            <strong>C.</strong> {renderHTML(soal.opsi_c)}
          </li>
          <li>
            <strong>D.</strong> {renderHTML(soal.opsi_d)}
          </li>
        </ul>
        <p className="mt-2 text-sm text-green-600">
          Jawaban Benar: {soal.jawaban_benar}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Dibuat pada: {formatDate(soal.created_at)}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500 animate-pulse">
        Memuat data...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">Tidak ada data soal.</div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.keys(grouped).map((latihanId) => {
        const latihan = latihanList.find(
          (l) => String(l?.id) === String(latihanId)
        );
        const namaLatihan = latihan?.judul || `Latihan ID - ${latihanId}`;

        return (
          <div key={latihanId} className="border-b pb-4">
            <h3 className="font-semibold text-blue-600 text-lg mb-2">
              {namaLatihan}
            </h3>
            <div className="space-y-4">
              {grouped[latihanId].map((soal) => (
                <div
                  key={soal.id}
                  className="p-4 border rounded-md shadow-sm bg-gray-50"
                >
                  {renderQuestionContent(soal)}
                  <div className="mt-3 flex gap-2">
                    <EditButton id={soal.id} />
                    <DeleteButton soalId={soal.id} setData={setData} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SoalCard;
