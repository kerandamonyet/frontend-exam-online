"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { formatDate } from "../../../../../utils/formatDate";
import { DetailButton } from "./Button";
import { getSoalByLatihanId } from "../../../../../lib/data";

function SoalCard({ currentPage, itemsPerPage }) {
  const params = useParams();
  const id_latihan = params?.id; // ID latihan dari URL
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id_latihan) return;
      try {
        const response = await getSoalByLatihanId(
          id_latihan,
          currentPage,
          itemsPerPage
        );
        setData(response.data || []);
      } catch (error) {
        console.error("Gagal mengambil data soal", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id_latihan, currentPage, itemsPerPage]);

  const parseOptions = (optionsStr) => {
    if (!optionsStr) return null;
    try {
      return JSON.parse(optionsStr);
    } catch (error) {
      console.error("Error parsing options JSON:", error);
      return null;
    }
  };

  if (loading) {
    return <div className="text-center col-span-full py-4">Memuat data...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.length > 0 ? (
        data.map((soal) => {
          const parsedOptions = parseOptions(soal.options);
          return (
            <div
              key={soal.id}
              className="border rounded-lg p-4 bg-white shadow-md"
            >
              <div className="mb-2">
                <span className="font-bold">ID Soal:</span> {soal.id}
              </div>
              <div className="mb-2">
                <span className="font-bold">Latihan ID:</span> {soal.latihan_id}
              </div>
              <div className="mb-2">
                <span className="font-bold">Text Soal:</span> {soal.text_soal}
              </div>
              <div className="mb-2">
                <span className="font-bold">Tipe Soal:</span> {soal.tipe_soal}
              </div>
              <div className="mb-2">
                <span className="font-bold">Options:</span>
                {parsedOptions ? (
                  <ul className="list-disc ml-4">
                    {Object.entries(parsedOptions).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-semibold">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "Tidak ada options"
                )}
              </div>
              <div className="mb-2">
                <span className="font-bold">Jawaban Benar:</span>{" "}
                {soal.jawaban_benar}
              </div>
              <div className="mb-2">
                <span className="font-bold">Created At:</span>{" "}
                {soal.created_at
                  ? formatDate(soal.created_at.toString())
                  : "Tidak ada tanggal"}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <DetailButton id={soal.id} />
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center col-span-full py-4">
          Tidak ada data soal
        </div>
      )}
    </div>
  );
}

export default SoalCard;
