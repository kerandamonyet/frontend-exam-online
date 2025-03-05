"use client";
import { useState } from "react";
import { IoAddSharp, IoPencil, IoTrashOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { deleteSesiLatihan } from "../../../../../lib/data";
import { FaEye } from "react-icons/fa6";

export const DeleteButton = ({ id, onDelete }) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteSesiLatihan(id);
        if (response.status === 200) {
          // Tampilkan alert sukses sebelum memperbarui tabel
          await Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data latihan berhasil dihapus.",
          });
          onDelete(); // Perbarui tabel setelah penghapusan
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus data latihan", error);
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus data latihan.",
        });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="inline-flex items-center space-x-1 text-white bg-red-700 hover:bg-red-800 px-5 py-[9px] rounded-md text-sm"
    >
      <IoTrashOutline size={20} />
    </button>
  );
};
