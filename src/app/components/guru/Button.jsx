"use client";
import { useState } from "react";
import CreateModal from "./CreateModal";
import Link from "next/link";
import { IoAddSharp, IoPencil, IoTrashOutline } from "react-icons/io5";

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
        onSubmit={onSubmit}
      />
    </>
  );
};

export const EditButton = () => {
  return (
    <Link
      href="/dashboard/guru/edit"
      className="inline-flex items-center space-x-1 text-white bg-green-700 hover:bg-green-800 px-5 py-[9px] rounded-md text-sm"
    >
      <IoPencil size={20} />
    </Link>
  );
};
export const DeleteButton = () => {
  return (
    <button
      href="/dashboard/guru/create"
      className="inline-flex items-center space-x-1 text-white bg-red-700 hover:bg-red-800 px-5 py-[9px] rounded-md text-sm"
    >
      <IoTrashOutline size={20} />
    </button>
  );
};
