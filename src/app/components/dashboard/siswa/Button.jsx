// components/Button.jsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import { IoAddSharp, IoPencil, IoTrashOutline } from "react-icons/io5";
import { deleteSiswa } from "../../../../../lib/data";

// --- CreateButton (tidak berubah) ---
export function CreateButton({ onSubmit }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-5 py-[9px] rounded-md text-white text-sm shadow-md transition"
      >
        <IoAddSharp size={20} />
        <span>Create</span>
      </button>
      <CreateModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
      />
    </>
  );
}

// --- EditButton: panggil onUpdate setelah modal submit berhasil ---
export function EditButton({ siswa, onUpdate }) {
  const [isOpen, setOpen] = useState(false);

  const handleSubmit = () => {
    // EditModal diperkirakan sudah memanggil API edit,
    // kita tinggal refresh list:
    onUpdate();
    setOpen(false);
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data siswa berhasil diperbarui.",
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center space-x-1 bg-green-700 hover:bg-green-800 px-5 py-[9px] rounded-md text-white text-sm"
      >
        <IoPencil size={20} />
      </button>
      <EditModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        siswa={siswa}
      />
    </>
  );
}

// --- DeleteButton: pastikan show success, bukan gagal ---
export function DeleteButton({ id, onDelete }) {
  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!isConfirmed) return;

    try {
      const res = await deleteSiswa(id);
      if (res?.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data siswa berhasil dihapus.",
        });
        onDelete();
      } else {
        throw new Error("Status bukan 200");
      }
    } catch (err) {
      console.error("Error hapus siswa:", err);
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data siswa.",
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center space-x-1 bg-red-700 hover:bg-red-800 px-5 py-[9px] rounded-md text-white text-sm"
    >
      <IoTrashOutline size={20} />
    </button>
  );
}
