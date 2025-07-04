"use client";
import { useState } from "react";
import EditModal from "./EditForm";
import { IoAddSharp, IoPencil, IoTrashOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { deleteSoal } from "../../../../../lib/data";
import { FaEye } from "react-icons/fa6";
import Link from "next/link";

export const CreateButton = () => {
  return (
    <Link href={`/dashboard/latihan/detail/${id}/soal`} passHref>
      <button className="inline-flex items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 px-5 py-[9px] rounded-md text-sm">
        <FaEye size={20} />
        buat soal
      </button>
    </Link>
  );
};

export const EditButton = ({ id }) => {
  return (
    <Link href={`/dashboard/soal/${id}/edit`}>
      <button className="inline-flex items-center space-x-1 text-white bg-green-700 hover:bg-green-800 px-5 py-2 rounded-md text-sm">
        <IoPencil size={20} />
      </button>
    </Link>
  );
};

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
        const response = await deleteSoal(id);
        if (response.status === 200) {
          await Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data latihan berhasil dihapus.",
          });
          onDelete(); // Memperbarui daftar/tabel setelah penghapusan
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
      className="inline-flex items-center space-x-1 text-white bg-red-700 hover:bg-red-800 px-5 py-2 rounded-md text-sm"
    >
      <IoTrashOutline size={20} />
    </button>
  );
};
