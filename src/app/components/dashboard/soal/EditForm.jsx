"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { updatedSoal } from "../../../../../lib/data";

const MySwal = withReactContent(Swal);

function EditForm({ onSubmit, id, initialData }) {
  const [formData, setFormData] = useState({
    latihan_id: "",
    text_soal: "",
    tipe_soal: "pilihan_ganda",
  });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [latihanList, setLatihanList] = useState([]);
  // Inisialisasi 4 opsi
  const [options, setOptions] = useState(["", "", "", ""]);
  // Gunakan index untuk jawaban benar (0 untuk 'a', 1 untuk 'b', dst.)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const { quill, quillRef } = useQuill();

  // Set initial data dan konversi jawaban benar ke indeks
  useEffect(() => {
    console.log("Initial Data:", initialData);
    if (initialData) {
      setFormData({
        latihan_id: initialData.latihan_id || "",
        text_soal: initialData.text_soal || "",
        tipe_soal: initialData.tipe_soal || "pilihan_ganda",
      });
      setOptions([
        initialData.opsi_a || "",
        initialData.opsi_b || "",
        initialData.opsi_c || "",
        initialData.opsi_d || "",
      ]);
      if (initialData.jawaban_benar) {
        const letter = initialData.jawaban_benar.toLowerCase();
        const index = letter.charCodeAt(0) - 97; // 'a' => 0, 'b' => 1, etc.
        setCorrectAnswerIndex(index);
      } else {
        setCorrectAnswerIndex(null);
      }
      if (quill && initialData.text_soal) {
        quill.clipboard.dangerouslyPasteHTML(initialData.text_soal);
      }
      console.log("Form data di-set:", {
        latihan_id: initialData.latihan_id || "",
        text_soal: initialData.text_soal || "",
        tipe_soal: initialData.tipe_soal || "pilihan_ganda",
      });
      console.log("Options di-set:", [
        initialData.opsi_a || "",
        initialData.opsi_b || "",
        initialData.opsi_c || "",
        initialData.opsi_d || "",
      ]);
      console.log("Correct Answer Index di-set:", correctAnswerIndex);
    }
  }, [initialData, quill]);

  // Update text_soal saat Quill berubah
  useEffect(() => {
    if (quill) {
      const handleTextChange = () => {
        const newText = quill.root.innerHTML;
        console.log("Text soalnya berubah:", newText);
        setFormData((prev) => ({
          ...prev,
          text_soal: newText,
        }));
      };
      quill.on("text-change", handleTextChange);
      return () => quill.off("text-change", handleTextChange);
    }
  }, [quill]);

  // Ambil daftar latihan dari API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/latihan")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        console.log("Data latihan:", data);
        setLatihanList(data);
      })
      .catch((err) => {
        console.error("Error fetching latihan:", err);
        setLatihanList([]);
      });
  }, []);

  // Validasi input
  const validate = () => {
    const newErrors = {};
    if (!formData.latihan_id.trim()) {
      newErrors.latihan_id = "Latihan wajib diisi";
    }
    if (!formData.text_soal || formData.text_soal === "<p><br></p>") {
      newErrors.text_soal = "Soal wajib diisi";
    }
    if (options.some((opt) => !opt.trim())) {
      newErrors.options = "Semua opsi harus diisi";
    }
    if (
      correctAnswerIndex === null ||
      correctAnswerIndex < 0 ||
      correctAnswerIndex > 3
    ) {
      newErrors.correctAnswer = "Jawaban benar wajib dipilih";
    }
    setErrors(newErrors);
    console.log("Errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Handle change - ${name}:`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    console.log(`Option ${index} diubah menjadi:`, value);
    setOptions(newOptions);
  };

  // Submit form dengan update parsial
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);

    const changedData = {};
    if (initialData) {
      if (formData.latihan_id !== initialData.latihan_id) {
        changedData.latihan_id = formData.latihan_id;
      }
      if (formData.text_soal !== initialData.text_soal) {
        changedData.text_soal = formData.text_soal;
      }
      if (formData.tipe_soal !== initialData.tipe_soal) {
        changedData.tipe_soal = formData.tipe_soal;
      }
      if (options[0] !== initialData.opsi_a) {
        changedData.opsi_a = options[0];
      }
      if (options[1] !== initialData.opsi_b) {
        changedData.opsi_b = options[1];
      }
      if (options[2] !== initialData.opsi_c) {
        changedData.opsi_c = options[2];
      }
      if (options[3] !== initialData.opsi_d) {
        changedData.opsi_d = options[3];
      }
      // Konversi indeks ke huruf ('a', 'b', 'c', 'd')
      const newJawabanBenar = String.fromCharCode(97 + correctAnswerIndex);
      if (newJawabanBenar !== initialData.jawaban_benar) {
        changedData.jawaban_benar = newJawabanBenar;
      }
    } else {
      Object.assign(changedData, {
        latihan_id: formData.latihan_id,
        text_soal: formData.text_soal,
        tipe_soal: formData.tipe_soal,
        opsi_a: options[0],
        opsi_b: options[1],
        opsi_c: options[2],
        opsi_d: options[3],
        jawaban_benar: String.fromCharCode(97 + correctAnswerIndex),
      });
    }

    console.log("Changed Data yang akan dikirim:", changedData);

    if (Object.keys(changedData).length === 0) {
      MySwal.fire({
        icon: "info",
        title: "Tidak Ada Perubahan",
        text: "Anda tidak mengubah field apapun.",
      });
      setPending(false);
      return onSubmit();
    }

    try {
      await updatedSoal(id, changedData);
      console.log("Update berhasil untuk soal dengan ID:", id);
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Soal berhasil diperbarui!",
      });
      onSubmit();
    } catch (error) {
      console.error("Error updating soal:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui soal.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 card border border-md shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Edit Soal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropdown Latihan */}
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

        {/* Tipe Soal */}
        <div>
          <label className="block text-sm font-semibold mb-2">Tipe Soal</label>
          <div className="flex items-center mb-2">
            <input
              id="radio-pg"
              type="radio"
              value="pilihan_ganda"
              name="tipe_soal"
              checked={formData.tipe_soal === "pilihan_ganda"}
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
              id="radio-tarik-garis"
              type="radio"
              value="tarik_garis"
              name="tipe_soal"
              checked={formData.tipe_soal === "tarik_garis"}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor="radio-tarik-garis"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Tarik Garis
            </label>
          </div>
          {errors.tipe_soal && (
            <p className="text-red-500 text-sm mt-1">{errors.tipe_soal}</p>
          )}
        </div>

        {/* Soal (Quill Editor) */}
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

        {/* Opsi Pilihan Ganda */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Opsi Pilihan Ganda
          </label>
          {options.map((option, index) => (
            <div
              key={`option-${index}`}
              className="flex items-center gap-2 mb-2 p-2 border rounded hover:bg-gray-50"
            >
              <label className="flex items-center gap-2 w-full">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={index}
                  checked={correctAnswerIndex === index}
                  onChange={() => {
                    console.log("Radio option dipilih index:", index);
                    setCorrectAnswerIndex(index);
                  }}
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
            </div>
          ))}
          {errors.options && (
            <p className="text-red-500 text-sm mt-1">{errors.options}</p>
          )}
          {errors.correctAnswer && (
            <p className="text-red-500 text-sm mt-1">{errors.correctAnswer}</p>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-2">
          <Link href="/dashboard/soal">
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

export default EditForm;
