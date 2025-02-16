"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function EditModal({ isOpen, onClose, onSubmit, siswa }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    nama_siswa: "",
    jenis_kelamin: "",
    tgl_lahir: "",
    kelas_id: "",
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [kelasList, setKelasList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:5000/api/kelas")
        .then((res) => {
          setKelasList(
            Array.isArray(res.data) ? res.data : res.data.data || []
          );
        })
        .catch(() => setKelasList([]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (siswa) {
      setFormData({
        nama_siswa: siswa.nama_siswa || "",
        jenis_kelamin: siswa.jenis_kelamin || "",
        tgl_lahir: siswa.tgl_lahir || "",
        kelas_id: siswa.kelas_id || "",
      });
    }
  }, [siswa, isOpen]);

  const validate = () => {
    let newErrors = {};
    if (!formData.nama_siswa.trim())
      newErrors.nama_siswa = "Nama siswa wajib diisi";
    if (!formData.kelas_id.trim()) newErrors.kelas_id = "Kelas ID wajib diisi";
    if (!formData.jenis_kelamin.trim())
      newErrors.jenis_kelamin = "Jenis kelamin wajib diisi";
    if (!formData.tgl_lahir.trim())
      newErrors.tgl_lahir = "Tanggal lahir wajib diisi";
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
        `http://localhost:5000/api/siswa/${siswa.id}`,
        formData
      );
      onSubmit();
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Siswa berhasil diperbarui!",
      });
      onClose();
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui siswa.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">Edit Siswa</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Siswa</label>
            <input
              type="text"
              name="nama_siswa"
              value={formData.nama_siswa}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kelas</label>
            <select
              name="kelas_id"
              value={formData.kelas_id}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
            >
              <option value="">Pilih Kelas</option>
              {kelasList.map((kelas) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama_kelas}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Jenis Kelamin</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Laki-laki"
                  name="jenis_kelamin"
                  checked={formData.jenis_kelamin === "Laki-laki"}
                  onChange={handleChange}
                  className="mr-2"
                />{" "}
                Laki-laki
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Perempuan"
                  name="jenis_kelamin"
                  checked={formData.jenis_kelamin === "Perempuan"}
                  onChange={handleChange}
                  className="mr-2"
                />{" "}
                Perempuan
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Tanggal Lahir</label>
            <input
              type="date"
              name="tgl_lahir"
              value={formData.tgl_lahir}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
            />
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
