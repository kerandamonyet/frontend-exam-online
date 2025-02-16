"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function EditModal({ isOpen, onClose, onSubmit, kelas }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    nama_kelas: "",
    tingkat: "",
    guru_id: "",
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [guruList, setGuruList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:5000/api/guru")
        .then((res) => {
          setGuruList(Array.isArray(res.data) ? res.data : res.data.data || []);
        })
        .catch(() => setGuruList([]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (kelas) {
      setFormData({
        nama_kelas: kelas.nama_kelas || "",
        tingkat: kelas.tingkat || "",
        guru_id: kelas.guru_id || "",
      });
    }
  }, [kelas, isOpen]);

  const validate = () => {
    let newErrors = {};
    if (!formData.nama_kelas.trim())
      newErrors.nama_kelas = "Nama kelas wajib diisi";
    if (!formData.tingkat.trim()) newErrors.tingkat = "Tingkat wajib diisi";
    if (!formData.guru_id) newErrors.guru_id = "Guru wajib dipilih";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);

    try {
      await axios.patch(
        `http://localhost:5000/api/kelas/${kelas.id}`,
        formData
      );
      onSubmit();
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kelas berhasil diperbarui!",
      });
      onClose();
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui kelas.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">Edit Kelas</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Kelas</label>
            <input
              type="text"
              name="nama_kelas"
              value={formData.nama_kelas}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tingkat</label>
            <input
              type="text"
              name="tingkat"
              value={formData.tingkat}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Guru</label>
            <select
              name="guru_id"
              value={formData.guru_id}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
            >
              <option value="">Pilih Guru</option>
              {guruList.map((guru) => (
                <option key={guru.id} value={guru.id}>
                  {guru.nama_guru}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending}
              className={`px-4 py-2 text-white rounded ${
                pending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
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
