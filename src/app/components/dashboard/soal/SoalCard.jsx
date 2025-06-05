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
    if (soal.tipe_soal === "tarik_garis") {
      // Parse data_tarik_garis jika berupa string
      let dataTarikGaris;
      try {
        dataTarikGaris =
          typeof soal.data_tarik_garis === "string"
            ? JSON.parse(soal.data_tarik_garis)
            : soal.data_tarik_garis;
      } catch (err) {
        console.error("Gagal parsing data_tarik_garis:", err);
        dataTarikGaris = {};
      }

      const {
        opsi_kiri = [],
        opsi_kanan = [],
        jawaban_benar = {},
      } = dataTarikGaris;

      return (
        <div>
          <p className="font-medium">
            <span className="font-bold">Soal {soal.nomorSoal}.</span>{" "}
            {renderHTML(soal.text_soal)}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm font-semibold text-purple-700">Opsi Kiri</p>
              <ul className="list-disc ml-5 text-sm text-gray-800">
                {opsi_kiri.map((item, index) => (
                  <li key={`kiri-${index}`}>{renderHTML(item)}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700">
                Opsi Kanan
              </p>
              <ul className="list-disc ml-5 text-sm text-gray-800">
                {opsi_kanan.map((item, index) => (
                  <li key={`kanan-${index}`}>{renderHTML(item)}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-2 text-sm text-green-600 font-semibold">
            Jawaban Benar:
          </p>
          <ul className="text-sm text-green-700 ml-4 list-disc">
            {(() => {
              // Cek apakah jawaban_benar ada dan berisi data
              if (
                jawaban_benar &&
                typeof jawaban_benar === "object" &&
                Object.keys(jawaban_benar).length > 0
              ) {
                return Object.entries(jawaban_benar).map(
                  ([kiri, kanan], index) => (
                    <li key={index}>
                      <span className="font-medium">{kiri}</span> →{" "}
                      <span className="font-medium">{kanan}</span>
                    </li>
                  )
                );
              }

              return (
                <li className="italic text-gray-500">Belum ada jawaban</li>
              );
            })()}
          </ul>

          <p className="text-xs text-gray-400 mt-1">
            Dibuat pada: {formatDate(soal.created_at)}
          </p>
        </div>
      );
    }
    // Default: pilihan ganda
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
                    <DeleteButton
                      id={soal.id}
                      onDelete={() => handleDelete(soal.id)}
                    />
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
