"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function CreateModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    nama_kelas: "",
    tingkat: "",
    guru_id: "",
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [guruList, setGuruList] = useState([]); // State untuk menyimpan daftar guru

  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:5000/api/guru")
        .then((res) => {
          console.log("Data dari API:", res.data); // Debugging
          setGuruList(Array.isArray(res.data) ? res.data : res.data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching guru:", err);
          setGuruList([]); // Hindari crash jika error
        });
    }
  }, [isOpen]);

  // Validasi Form
  const validate = () => {
    let newErrors = {};

    if (!formData.nama_kelas.trim())
      newErrors.nama_kelas = "Nama kelas wajib diisi";
    if (!formData.tingkat.trim()) newErrors.tingkat = "Tingkat wajib diisi";
    if (!formData.guru_id) newErrors.guru_id = "Guru wajib dipilih";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);

    try {
      await axios.post("http://localhost:5000/api/kelas", formData);
      onSubmit();
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kelas berhasil ditambahkan!",
      });
      setFormData({ nama_kelas: "", tingkat: "", guru_id: "" });
      onClose();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan kelas.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">Tambah Kelas</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Nama Kelas */}
          <div>
            <label className="block text-sm font-medium">Nama Kelas</label>
            <input
              type="text"
              name="nama_kelas"
              value={formData.nama_kelas}
              onChange={handleChange}
              placeholder="A"
              required
              className={`w-full p-2 border rounded ${
                errors.nama_kelas ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nama_kelas && (
              <p className="text-red-500 text-sm mt-1">{errors.nama_kelas}</p>
            )}
          </div>

          {/* Tingkat */}
          <div>
            <label className="block text-sm font-medium">Tingkat</label>
            <input
              type="text"
              name="tingkat"
              placeholder="2024"
              required
              value={formData.tingkat}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.tingkat ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.tingkat && (
              <p className="text-red-500 text-sm mt-1">{errors.tingkat}</p>
            )}
          </div>

          {/* Guru ID (Dropdown) */}
          <div>
            <label className="block text-sm font-medium">Guru</label>
            <select
              name="guru_id"
              value={formData.guru_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.guru_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Guru</option>
              {guruList.map((guru) => (
                <option key={guru.id} value={guru.id}>
                  {guru.nama_guru}
                </option>
              ))}
            </select>
            {errors.guru_id && (
              <p className="text-red-500 text-sm mt-1">{errors.guru_id}</p>
            )}
          </div>

          {/* Tombol Aksi */}
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

export default CreateModal;
