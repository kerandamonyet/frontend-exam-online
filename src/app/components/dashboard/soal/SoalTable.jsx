import React from "react";
import { formatDate } from "../../../../../utils/formatDate";
import { EditButton, DeleteButton, DetailButton } from "./Button";
import { getLatihan } from "../../../../../lib/data";
import { formatDateNoTime } from "../../../../../utils/formatDateNotime";

function SoalTable({ data, setData, currentPage, itemsPerPage }) {
  const handleDelete = async () => {
    try {
      const { data } = await getLatihan(currentPage, itemsPerPage);
      setData(data);
    } catch (error) {
      console.error("Gagal memperbarui data setelah penghapusan", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await getLatihan(currentPage, itemsPerPage);
      setData(data);
    } catch (error) {
      console.error("Gagal memperbarui data setelah penghapusan", error);
    }
  };

  return (
    <div className="w-full p-4 rounded-lg shadow-md flex justify-between items-start hover:bg-slate-300">
      <div>
        <h3 className="font-semibold text-gray-800">Pertanyaan</h3>
        <ul className="mt-2">
          <li className="text-gray-700">opsi a</li>
          <li className="text-gray-700">opsi a</li>
          <li className="text-gray-700">opsi a</li>
        </ul>
      </div>
      <div className="flex gap-2">
        <EditButton />
        <DeleteButton />
      </div>
    </div>
  );
}

export default SoalTable;
