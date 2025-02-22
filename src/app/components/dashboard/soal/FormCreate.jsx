"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Add css for snow theme

const MySwal = withReactContent(Swal);

function FormCreate({ onSubmit }) {
  // State untuk input non-dinamis
  const [formData, setFormData] = useState({
    latihan_id: "",
    text_soal: "",
    tipe_soal: "pilihan_ganda", // default pilih pilihan ganda
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [latihanList, setLatihanList] = useState([]);

  // State untuk opsi pilihan ganda dan jawaban benar
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const { quill, quillRef } = useQuill();

  // Update state text_soal setiap kali terjadi perubahan pada Quill
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setFormData((prev) => ({ ...prev, text_soal: quill.root.innerHTML }));
      });
    }
  }, [quill]);

  // Ambil daftar latihan dari API saat komponen di-mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/latihan")
      .then((res) => {
        console.log("Data dari API:", res.data);
        setLatihanList(
          Array.isArray(res.data) ? res.data : res.data.data || []
        );
      })
      .catch((err) => {
        console.error("Error fetching latihan:", err);
        setLatihanList([]);
      });
  }, []);

  // Validasi Form
  const validate = () => {
    let newErrors = {};

    if (!formData.latihan_id.trim()) {
      newErrors.latihan_id = "Latihan wajib diisi";
    }
    // Cek apakah text_soal kosong atau hanya berisi tag kosong
    if (!formData.text_soal || formData.text_soal === "<p><br></p>") {
      newErrors.text_soal = "Soal wajib diisi";
    }
    if (options.some((opt) => !opt.trim())) {
      newErrors.options = "Semua opsi harus diisi";
    }
    if (!correctAnswer.trim()) {
      newErrors.correctAnswer = "Jawaban benar wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle perubahan pada input non-dinamis
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle perubahan pada opsi
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    // Jika opsi yang diubah adalah jawaban benar, perbarui juga state correctAnswer
    if (correctAnswer === options[index]) {
      setCorrectAnswer(value);
    }
    setErrors((prev) => ({ ...prev, options: "" }));
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const removedOption = options[index];
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctAnswer === removedOption) {
        setCorrectAnswer("");
      }
    }
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);

    try {
      await axios.post("http://localhost:5000/api/latihan/soal", {
        latihan_id: formData.latihan_id,
        text_soal: formData.text_soal,
        tipe_soal: formData.tipe_soal,
        options: options,
        jawaban_benar: correctAnswer,
      });

      onSubmit();
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Soal berhasil ditambahkan!",
      });

      setFormData({
        latihan_id: "",
        text_soal: "",
        tipe_soal: "pilihan_ganda",
      });
      if (quill) {
        quill.setContents([]);
      }
      setOptions(["", ""]);
      setCorrectAnswer("");
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan soal.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 card border border-md shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Tambah Soal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Latihan ID (dropdown) */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Nama Latihan
          </label>
          <select
            name="latihan_id"
            value={formData.latihan_id}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.latihan_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Pilih Latihan</option>
            {latihanList.map((latihan) => (
              <option key={latihan.id_latihan} value={latihan.id_latihan}>
                {latihan.nama_latihan}
              </option>
            ))}
          </select>
          {errors.latihan_id && (
            <p className="text-red-500 text-sm mt-1">{errors.latihan_id}</p>
          )}
        </div>
        {/* tipe soal */}
        <div>
          <label className="block text-sm font-semibold mb-2">Tipe Soal</label>
          <div className="flex items-center mb-2">
            <input
              defaultChecked
              id="radio-pg"
              type="radio"
              value="pilihan_ganda"
              name="tipe_soal"
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor="radio-pg"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Pilihan Ganda
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              id="radio-drag-drop"
              type="radio"
              value="drag_drop"
              name="tipe_soal"
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor="radio-drag-drop"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Drag and Drop
            </label>
          </div>
          {errors.tipe_soal && (
            <p className="text-red-500 text-sm mt-1">{errors.tipe_soal}</p>
          )}
        </div>
        {/* Soal menggunakan Quill */}
        <div>
          <label className="block text-sm font-semibold mb-2">Soal</label>
          <div
            ref={quillRef}
            className={`w-full p-2 border rounded ${
              errors.text_soal ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.text_soal && (
            <p className="text-red-500 text-sm mt-1">{errors.text_soal}</p>
          )}
        </div>

        {/* Input opsi pilihan ganda dan pemilihan jawaban benar */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Opsi Pilihan Ganda
          </label>
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-2 mb-2 p-2 border rounded hover:bg-gray-50"
            >
              <label className="flex items-center gap-2 w-full">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={option}
                  checked={correctAnswer === option}
                  onChange={() => setCorrectAnswer(option)}
                  className="h-6 w-6 accent-blue-600 focus:ring-2 focus:ring-black"
                />
                <span className="text-sm font-medium">
                  Pilihan {String.fromCharCode(65 + index)}:
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Isi opsi ${String.fromCharCode(65 + index)}`}
                  required
                  className="border p-2 flex-1"
                />
              </label>
              <button
                type="button"
                onClick={() => removeOption(index)}
                disabled={options.length <= 2}
                className="text-red-500"
              >
                ❌
              </button>
            </div>
          ))}
          {errors.options && (
            <p className="text-red-500 text-sm mt-1">{errors.options}</p>
          )}
          {errors.correctAnswer && (
            <p className="text-red-500 text-sm mt-1">{errors.correctAnswer}</p>
          )}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 inline-block text-blue-600"
          >
            ➕ Tambah Opsi
          </button>
        </div>

        {/* Tombol aksi */}
        <div className="flex justify-end space-x-2">
          <Link href="/dashboard/latihan">
            <button
              type="button"
              disabled={pending}
              className="px-4 py-2 text-white bg-gray-400 rounded"
            >
              Kembali
            </button>
          </Link>
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
  );
}

export default FormCreate;
