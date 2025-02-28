"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";

const LoginFormSiswa = () => {
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validasi form
  const validateForm = () => {
    let valid = true;
    let newErrors = { username: "", password: "" };

    if (!username) {
      newErrors.username = "Nama pengguna tidak boleh kosong.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Kata sandi tidak boleh kosong.";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Kata sandi harus 8 karakter.";
      valid = false;
    } else if (password.length > 8) {
      newErrors.password = "Kata sandi tidak boleh lebih dari 8 karakter.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      MySwal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Ada yang belum diisi nih, coba periksa lagi ya!",
        confirmButtonText: "Siap!",
        confirmButtonColor: "#4CAF50",
        background: "#FFFDE7",
        customClass: {
          title: "text-yellow-600 font-bold",
          content: "text-yellow-700",
        },
      });
    }

    return valid;
  };

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setPending(true);
    console.log("🔄 [LOGIN] Mengirim data:", { username, password });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/siswa/login",
        {
          username,
          password,
        }
      );

      console.log("✅ [LOGIN] Token diterima:", response.data.token);

      Cookies.set("auth-token", response.data.token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      MySwal.fire({
        icon: "success",
        title: "Yeay! Berhasil Masuk!",
        text: "Selamat belajar, Sobat Pintar!",
        confirmButtonText: "Asyik!",
        confirmButtonColor: "#4CAF50",
        background: "#E8F5E9",
        customClass: {
          title: "text-green-600 font-bold",
          content: "text-green-700",
        },
      });

      router.push("/biodata");
    } catch (error) {
      console.error("❌ [LOGIN] Error:", error.response?.data || error.message);
      MySwal.fire({
        icon: "error",
        title: "Gagal Masuk",
        text: "Nama pengguna atau kata sandi salah. Coba ingat-ingat lagi ya!",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#EF5350",
        background: "#FFEBEE",
        customClass: {
          title: "text-red-600 font-bold",
          content: "text-red-700",
        },
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-200 to-pink-300">
      <div className="w-full max-w-md p-6 bg-white border-4 border-yellow-400 rounded-3xl shadow-xl m-4 transform hover:scale-102 transition-transform duration-300">
        {/* Header dengan karakter lucu */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 relative mb-4">
            <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
              {/* Placeholder untuk karakter kartun */}
              <div className="text-5xl">🧒</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-1">
            Halo, Sobat Pintar!
          </h1>
          <p className="text-md text-center text-purple-700 font-medium">
            Yuk, masuk ke akun belajarmu!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-blue-50 p-4 rounded-xl">
            <label
              htmlFor="username"
              className="block mb-2 text-md font-bold text-blue-700"
            >
              Nama Pengguna
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-xl">👤</span>
              </div>
              <input
                type="text"
                name="username"
                id="username"
                className="bg-white border-2 border-blue-300 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 py-3"
                placeholder="Masukkan nama penggunamu"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username}</p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-xl">
            <label
              htmlFor="password"
              className="block mb-2 text-md font-bold text-blue-700"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-xl">🔑</span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Masukkan kata sandimu"
                className="bg-white border-2 border-blue-300 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-12 py-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="text-xl">{showPassword ? "🙈" : "👁️"}</span>
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="w-5 h-5 border-2 border-blue-300 rounded bg-blue-50 focus:ring-3 focus:ring-blue-300"
            />
            <label
              htmlFor="remember"
              className="ms-2 text-md font-medium text-purple-700"
            >
              Ingat aku ya!
            </label>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-xl text-lg px-5 py-4 text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {pending ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">🔄</span> Tunggu ya...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2">🚀</span> Masuk Sekarang!
              </span>
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Lupa kata sandi? Tanyakan ke Guru ya!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginFormSiswa;
