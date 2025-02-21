"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function EditModal({ isOpen, onClose, onSubmit, guru }) {
  if (!isOpen) return null;

  console.log("EditModal rendered. isOpen:", isOpen, "guru:", guru);

  const [formData, setFormData] = useState({
    nama_guru: guru?.nama_guru || "",
    user_password: "",
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (isOpen && guru) {
      console.log("Modal opened. Guru data:", guru);
      setFormData({
        nama_guru: guru.nama_guru || "",
        user_password: "",
      });
      setErrors({});
    }
  }, [guru, isOpen]);

  const handleClose = () => {
    console.log("Closing modal.");
    setErrors({});
    onClose();
  };

  const validate = () => {
    const newErrors = {};
    console.log("Validating formData:", formData);

    if (!formData.nama_guru.trim() && !formData.user_password.trim()) {
      newErrors.general = "Silahkan isi minimal 1 field untuk diupdate.";
      console.log("Validation error: Tidak ada field yang diisi.");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("handleChange:", name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered with formData:", formData);
    if (!validate()) {
      console.log("Validation failed.");
      return;
    }

    // Pengecekan apakah data guru tersedia
    if (!guru || !guru.id) {
      console.error("Guru data is missing or undefined:", guru);
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Data guru tidak tersedia.",
      });
      return;
    }

    setPending(true);

    try {
      const dataToUpdate = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] && key !== "user_password") {
          dataToUpdate[key] = formData[key];
        }
      });

      // Hanya kirim password jika diisi
      if (formData.user_password.trim() !== "") {
        dataToUpdate.user_password = formData.user_password;
      }

      console.log("Data to update:", dataToUpdate);

      if (Object.keys(dataToUpdate).length === 0) {
        MySwal.fire({
          icon: "warning",
          title: "Peringatan!",
          text: "Tidak ada perubahan yang dilakukan.",
        });
        console.log("Tidak ada data untuk diupdate.");
        setPending(false);
        return;
      }

      console.log("Sending patch request to API with guru.id:", guru.id);
      const response = await axios.patch(
        `http://localhost:5000/api/guru/${guru.id}`,
        dataToUpdate
      );
      console.log("API response:", response.data);

      onSubmit();
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data guru berhasil diperbarui!",
      });
      handleClose();
    } catch (error) {
      console.error("Error updating guru:", error.response?.data || error);
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui data guru.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg text-black font-semibold">Edit Guru</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Field Nama Guru */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Nama Guru
            </label>
            <input
              type="text"
              name="nama_guru"
              placeholder="John Doe"
              value={formData.nama_guru}
              onChange={handleChange}
              className={`w-full p-2 border rounded text-black ${
                errors.nama_guru ? "border-red-500" : "border-gray-500"
              }`}
            />
            {errors.nama_guru && (
              <p className="text-red-500 text-sm mt-1">{errors.nama_guru}</p>
            )}
          </div>

          {/* Field Email yang bersifat disabled */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={guru?.email || ""}
              disabled
              className="w-full p-2 border rounded text-black bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* Field Password */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Password (Opsional)
            </label>
            <input
              type="password"
              name="user_password"
              placeholder="******"
              value={formData.user_password}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black border-gray-500"
            />
            <p className="text-gray-500 text-sm mt-1">
              Biarkan kosong jika tidak ingin mengubah password
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded text-black"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending}
              className={`px-4 py-2 rounded text-white ${
                pending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {pending ? "Loading..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
