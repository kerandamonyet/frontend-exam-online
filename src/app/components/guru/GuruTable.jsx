import React from "react";
import { formatDate } from "../../../../utils/formatDate";
import { EditButton, DeleteButton } from "./Button";

function GuruTable({ data }) {
  return (
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-sm text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="py-3 px-6">ID</th>
          <th className="py-3 px-6">Nama</th>
          <th className="py-3 px-6">Email</th>
          <th className="py-3 px-6">Created At</th>
          <th className="py-3 px-6 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((guru) => (
            <tr key={guru.id} className="border-b">
              <td className="py-3 px-6 text-center">{guru.id}</td>
              <td className="py-3 px-6">{guru.nama_guru}</td>
              <td className="py-3 px-6">{guru.email}</td>
              <td className="py-3 px-6">
                {guru.created_at
                  ? formatDate(guru.created_at.toString())
                  : "Tidak ada tanggal"}
              </td>
              <td className="flex justify-center gap-1 py-3">
                <EditButton />
                <DeleteButton />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4">
              Tidak ada data guru
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default GuruTable;
