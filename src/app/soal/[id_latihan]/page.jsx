"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Header from "@/app/components/soal/Header";
import LoadingScreen from "@/app/components/soal/LoadingScreen";
import EmptyStateScreen from "@/app/components/soal/EmptyStateScreen";
import QuestionContent from "@/app/components/soal/QuestionContent";
import FeedbackToast from "@/app/components/soal/FeedbackToast";
import NavigationPanel from "@/app/components/soal/NavigationPanel";
import ReviewMode from "@/app/components/soal/ReviewMode";

export default function SoalPage() {
  const router = useRouter();
  const { id_latihan } = useParams();
  const MySwal = withReactContent(Swal);
  const [soal, setSoal] = useState([]);
  const [formData, setFormData] = useState({ id_siswa: "", jawaban_siswa: {} });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 0.1); // 60 minutes in seconds
  const [unsureQuestions, setUnsureQuestions] = useState({}); // Track unsure questions
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState("success");
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  useEffect(() => {
    const tokenJWT = Cookies.get("auth-token");
    if (!tokenJWT) {
      setLoading(false);
      return router.push("/login-siswa");
    }
    try {
      const decoded = jwtDecode(tokenJWT);
      setFormData((prev) => ({
        ...prev,
        id_siswa: decoded.id,
        id_latihan: decoded.id_latihan || "",
        nama_siswa: decoded.namaSiswa || "",
      }));
    } catch (err) {
      console.error("Token Error:", err);
      router.push("/login-siswa");
    }
  }, [router]);

  useEffect(() => {
    if (id_latihan) {
      axios
        .get(`http://localhost:5000/api/latihan/${id_latihan}/soal`)
        .then((response) => {
          const data = response.data.data || [];
          // Limit to only 30 questions
          const limitedData = Array.isArray(data) ? data.slice(0, 30) : [];
          setSoal(limitedData);
        })
        .catch((error) => console.error("Gagal mengambil soal:", error))
        .finally(() => setLoading(false));
    }
  }, [id_latihan]);

  const handleJawabanChange = (jawaban) => {
    setFormData((prev) => ({
      ...prev,
      jawaban_siswa: { ...prev.jawaban_siswa, [currentSoal.id]: jawaban },
    }));
  };

  const handleSubmit = () => {
    // Nothing to save if no answer has been selected
    if (!formData.jawaban_siswa[currentSoal.id]) {
      return;
    }

    // Show feedback animation to confirm the answer was "saved" (though only in state)
    const feedbackEl = document.getElementById("feedback");
    if (feedbackEl) {
      feedbackEl.classList.remove("hidden");
      setTimeout(() => {
        feedbackEl.classList.add("hidden");
      }, 2000);
    }

    // Navigate to next question if not at the end
    if (currentIndex < soal.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Toggle unsure status for the current question
  const toggleUnsure = () => {
    const currentSoal = soal[currentIndex];
    setUnsureQuestions((prev) => ({
      ...prev,
      [currentSoal.id]: !prev[currentSoal.id],
    }));
    showFeedbackToast("unsure");
  };

  const showFeedbackToast = (type) => {
    setFeedbackType(type);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  // Function to submit all answers at once
  // Fungsi untuk mengirim semua jawaban
  const submitAllAnswers = async () => {
    if (submitting || submitted) return;

    const hasAnswers = Object.keys(formData.jawaban_siswa).length > 0;
    if (!hasAnswers) {
      const result = await MySwal.fire({
        icon: "warning",
        title: "Tidak Ada Jawaban",
        text: "Anda belum menjawab satu pun soal. Yakin ingin mengirim?",
        showCancelButton: true,
        confirmButtonText: "Ya, Kirim",
        cancelButtonText: "Batalkan",
        reverseButtons: true,
      });

      // If user cancels, stop the submission process
      if (!result.isConfirmed) {
        return;
      }
    }
    setSubmitting(true);

    try {
      // Prepare submission data
      const requestBody = {
        id_siswa: formData.id_siswa,
        jawaban_siswa: Object.keys(formData.jawaban_siswa).map((id_soal) => ({
          id_soal,
          jawaban_siswa: formData.jawaban_siswa[id_soal],
        })),
        id_latihan,
        submissionType: hasAnswers ? "partial" : "empty",
      };

      const response = await axios.post(
        "http://localhost:5000/api/jawaban/submit",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSubmitted(true);

      // Different messages based on whether answers were submitted
      if (hasAnswers) {
        await MySwal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Jawaban Anda telah dikirim.",
        });
      } else {
        await MySwal.fire({
          icon: "info",
          title: "Ujian Selesai",
          text: "Anda mengirim ujian tanpa menjawab satu pun soal.",
        });
      }

      // Only show success modal if not already shown during timer expiration
      if (!isTimerExpired) {
        await MySwal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Kirim jawaban berhasil!",
        });
      }

      // Redirect to results page
      router.push(`/hasil/${id_latihan}/${formData.id_siswa}`);
    } catch (error) {
      console.error("Error submitting answers:", error);

      // Comprehensive error handling
      if (error.response) {
        await MySwal.fire({
          icon: "error",
          title: "Gagal Mengirim Jawaban",
          text:
            error.response.data.message ||
            "Terjadi kesalahan saat mengirim jawaban",
        });
      } else if (error.request) {
        await MySwal.fire({
          icon: "error",
          title: "Tidak Ada Respon",
          text: "Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.",
        });
      } else {
        await MySwal.fire({
          icon: "error",
          title: "Kesalahan",
          text: error.message,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Modify the timer expiration handler to use the same submission logic
  const handleTimerExpiration = useCallback(async () => {
    if (isTimerExpired) return;

    setIsTimerExpired(true);

    await MySwal.fire({
      icon: "warning",
      title: "Waktu Habis!",
      text: "Ujian telah berakhir. Jawaban akan dikirim secara otomatis.",
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });

    // Call the same submission method
    await submitAllAnswers();
  }, [isTimerExpired, submitAllAnswers, MySwal]);

  // Timer effect
  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleTimerExpiration();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(timer);
    }
  }, [loading, handleTimerExpiration]);

  // Calculate stats
  const getStats = () => {
    return {
      totalAnswered: Object.keys(formData.jawaban_siswa).length,
      totalUnsure: Object.keys(unsureQuestions).filter(
        (id) => unsureQuestions[id]
      ).length,
      totalUnanswered: soal.length - Object.keys(formData.jawaban_siswa).length,
    };
  };

  if (loading) return <LoadingScreen />;
  if (!soal.length)
    return <EmptyStateScreen onBackClick={() => router.push("/biodata")} />;

  const currentSoal = soal[currentIndex];

  if (isReviewMode) {
    return (
      <ReviewMode
        soal={soal}
        formData={formData}
        unsureQuestions={unsureQuestions}
        timeLeft={timeLeft}
        stats={getStats()}
        onBackClick={() => setIsReviewMode(false)}
        onSubmitAll={submitAllAnswers}
        submitting={submitting}
        submitted={submitted}
        onQuestionClick={(index) => {
          setIsReviewMode(false);
          setCurrentIndex(index);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <Header timeLeft={timeLeft} studentName={formData.nama_siswa} />

        {showFeedback && <FeedbackToast type={feedbackType} />}

        <div className="p-4">
          {/* Mobile: Question number progress */}
          <div className="mb-4 text-center">
            <div className="bg-purple-100 inline-block px-6 py-2 rounded-full">
              <span className="text-purple-800 font-bold">
                Soal {currentIndex + 1} dari {soal.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Questions & Answers */}
            <div className="md:w-3/4 order-2 md:order-1">
              <QuestionContent
                currentSoal={currentSoal}
                currentAnswer={formData.jawaban_siswa[currentSoal.id]}
                isUnsure={unsureQuestions[currentSoal.id]}
                onAnswerChange={handleJawabanChange}
                onToggleUnsure={toggleUnsure}
                onSaveAnswer={handleSubmit}
                onReviewClick={() => setIsReviewMode(true)}
                onNextClick={() =>
                  setCurrentIndex((prev) => Math.min(soal.length - 1, prev + 1))
                }
                onPrevClick={() =>
                  setCurrentIndex((prev) => Math.max(0, prev - 1))
                }
                isFirstQuestion={currentIndex === 0}
                isLastQuestion={currentIndex === soal.length - 1}
              />
            </div>

            {/* Question Navigation */}
            <div className="md:w-1/4 order-1 md:order-2">
              <NavigationPanel
                soal={soal}
                currentIndex={currentIndex}
                answers={formData.jawaban_siswa}
                unsureQuestions={unsureQuestions}
                onQuestionClick={setCurrentIndex}
                onReviewClick={() => setIsReviewMode(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
