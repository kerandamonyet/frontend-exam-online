import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaQuestion,
  FaSave,
} from "react-icons/fa";

export default function QuestionContent({
  currentSoal,
  currentAnswer,
  isUnsure,
  onAnswerChange,
  onToggleUnsure,
  onSaveAnswer,
  onReviewClick,
  onNextClick,
  onPrevClick,
  isFirstQuestion,
  isLastQuestion,
}) {
  // Ambil opsi dari properti individual pada currentSoal
  const options = [
    currentSoal.opsi_a,
    currentSoal.opsi_b,
    currentSoal.opsi_c,
    currentSoal.opsi_d,
  ];

  return (
    <>
      <div
        className={`p-5 rounded-xl mb-4 ${
          isUnsure ? "bg-yellow-50 border-2 border-yellow-200" : "bg-purple-50"
        }`}
      >
        {isUnsure && (
          <div className="mb-2 inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
            <span className="mr-1">🤔</span>
            Ragu-ragu
          </div>
        )}
        <p
          className="text-lg text-gray-800"
          dangerouslySetInnerHTML={{ __html: currentSoal.text_soal }}
        ></p>
      </div>

      <div className="space-y-3">
        {options.map((option, i) => {
          // Huruf yang dikirim adalah lowercase (a, b, c, d)
          const letter = String.fromCharCode(97 + i);
          // Untuk tampilan, gunakan huruf kapital (A, B, C, D)
          const displayLetter = String.fromCharCode(65 + i);
          return (
            <div
              key={`option-${i}`}
              className={`rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                currentAnswer === letter
                  ? isUnsure
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                  : "bg-white border-2 border-gray-200 hover:border-purple-300"
              }`}
              onClick={() => onAnswerChange(letter)}
            >
              <div className="p-4 flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    currentAnswer === letter
                      ? "bg-white text-purple-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <span className="font-bold">{displayLetter}</span>
                </div>
                <div>{option}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-wrap justify-between mt-6 gap-2">
        <button
          onClick={onPrevClick}
          disabled={isFirstQuestion}
          className={`px-5 py-2 rounded-full flex items-center gap-2 ${
            isFirstQuestion
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-purple-100 text-purple-600 hover:bg-purple-200"
          }`}
        >
          <FaArrowLeft size={14} />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={onToggleUnsure}
            className={`px-5 py-2 rounded-full flex items-center gap-2 ${
              isUnsure
                ? "bg-yellow-400 text-white"
                : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
            }`}
          >
            <FaQuestion size={14} />
            <span>Ragu-ragu</span>
          </button>

          <button
            onClick={onSaveAnswer}
            className="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FaSave size={14} />
            <span>Simpan</span>
          </button>
        </div>

        {isLastQuestion ? (
          <button
            onClick={onReviewClick}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FaEye size={14} />
            <span className="hidden sm:inline">Review Jawaban</span>
          </button>
        ) : (
          <button
            onClick={onNextClick}
            className="px-5 py-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-full flex items-center gap-2"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <FaArrowRight size={14} />
          </button>
        )}
      </div>
    </>
  );
}
