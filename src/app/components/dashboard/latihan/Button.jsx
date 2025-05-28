"use client";
import { useState } from "react";
import EditModal from "./EditForm";
import { IoAddSharp, IoPencil, IoTrashOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { getLatihan, deleteLatihan } from "../../../../../lib/data";
import { FaEye } from "react-icons/fa6";
import Link from "next/link";

export const DetailButton = ({ id }) => {
  return (
    <Link href={`/dashboard/latihan/detail/${id}`} passHref>
      <button className="inline-flex items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 px-5 py-[9px] rounded-md text-sm">
        <FaEye size={20} />
      </button>
    </Link>
  );
};

export const EditButton = ({ latihan, onUpdate }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    console.log("Modal ditutup");
    setModalOpen(false);
  };

  const handleModalSubmit = () => {
    console.log("Modal submit telah berhasil");
    // Misalnya, panggil fungsi refresh data atau update list dari parent
    if (onUpdate) {
      onUpdate();
    }
    setModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => {
          console.log("Membuka modal edit");
          setModalOpen(true);
        }}
        className="inline-flex items-center space-x-1 text-white bg-green-700 hover:bg-green-800 px-5 py-[9px] rounded-md text-sm"
      >
        <IoPencil size={20} />
      </button>
      <EditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        latihan={latihan} // Pastikan data latihan sudah tersedia
      />
    </>
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
        const response = await deleteLatihan(id);
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
