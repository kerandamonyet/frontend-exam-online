"use client";
import { useState } from "react";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import { IoAddSharp, IoPencil, IoTrashOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { getGuru, deleteGuru } from "../../../../../lib/data";

export const CreateButton = ({ onSubmit }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 px-5 py-[9px] rounded-sm text-sm"
      >
        <IoAddSharp size={20} />
        Create
      </button>
      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit} // Callback untuk update tabel
      />
    </>
  );
};

export const EditButton = ({ guru, onUpdate }) => {
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
        guru={guru} // Pastikan data guru sudah tersedia
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
        const response = await deleteGuru(id);
        if (response.status === 200) {
          // Tampilkan alert sukses sebelum memperbarui tabel
          await Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data Guru berhasil dihapus.",
          });
          onDelete(); // Perbarui tabel setelah penghapusan
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus data guru", error);
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
