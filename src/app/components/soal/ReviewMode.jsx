// components/ReviewMode.jsx
import { FaArrowLeft, FaCheck, FaClock, FaUserGraduate } from "react-icons/fa";

export default function ReviewMode({
  soal,
  formData,
  unsureQuestions,
  timeLeft,
  stats,
  onBackClick,
  onSubmitAll,
  submitting,
  submitted,
  onQuestionClick,
}) {
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 120);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-purple-50 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white rounded-t-2xl">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <FaClock className="text-yellow-300" size={18} />
              <p className="font-mono font-bold">{formatTime(timeLeft)}</p>
            </div>

            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <FaUserGraduate className="text-yellow-300" size={18} />
              <input
                type="text"
                value={formData.nama_siswa}
                disabled
                className="bg-transparent text-white border-none outline-none font-semibold max-w-32 sm:max-w-none truncate"
              />
            </div>
          </div>
        </div>

        {/* Review Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-purple-800 mb-6">
            Review Jawaban
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="text-green-500 text-2xl font-bold">
                {stats.totalAnswered}
              </div>
              <div className="text-green-700">Soal Terjawab</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="text-yellow-500 text-2xl font-bold">
                {stats.totalUnsure}
              </div>
              <div className="text-yellow-700">Ragu-ragu</div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="text-red-500 text-2xl font-bold">
                {stats.totalUnanswered}
              </div>
              <div className="text-red-700">Belum Terjawab</div>
            </div>
          </div>

          {/* Question Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-700 mb-3">
              Navigasi Soal:
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {soal.map((question, index) => {
                const questionId = question.id;
                const isAnswered = !!formData.jawaban_siswa[questionId];
                const isUnsure = unsureQuestions[questionId];

                return (
                  <button
                    key={index}
                    onClick={() => onQuestionClick(index)}
                    className={`aspect-square min-w-10 min-h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all text-base font-bold ${
                      isAnswered
                        ? isUnsure
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm"
                          : "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm"
                        : isUnsure
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
              <span className="text-gray-600 text-sm">Sudah dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
              <span className="text-gray-600 text-sm">Ragu-ragu & dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-200"></div>
              <span className="text-gray-600 text-sm">
                Ragu-ragu belum dijawab
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-100"></div>
              <span className="text-gray-600 text-sm">Belum dijawab</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={onBackClick}
              className="px-6 py-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-all flex items-center gap-2"
            >
              <FaArrowLeft size={16} />
              <span>Kembali ke Soal</span>
            </button>

            <button
              onClick={onSubmitAll}
              disabled={submitting || submitted}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                submitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : submitted
                  ? "bg-green-500 text-white"
                  : "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg"
              }`}
            >
              {submitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
                  <span>Mengirim...</span>
                </>
              ) : submitted ? (
                <>
                  <FaCheck size={16} />
                  <span>Terkirim</span>
                </>
              ) : (
                <>
                  <FaCheck size={16} />
                  <span>Kirim Semua Jawaban</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
