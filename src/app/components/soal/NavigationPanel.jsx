// components/NavigationPanel.jsx
import { FaEye } from "react-icons/fa";

export default function NavigationPanel({
  soal,
  currentIndex,
  answers,
  unsureQuestions,
  onQuestionClick,
  onReviewClick,
}) {
  return (
    <div className="bg-white border border-purple-100 p-4 rounded-xl shadow-sm">
      <h2 className="text-center font-bold text-purple-800 mb-4">
        Navigasi Soal
      </h2>

      {/* Question navigation grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {soal.map((question, index) => {
          const questionId = question.id;
          const isAnswered = !!answers[questionId];
          const isUnsure = unsureQuestions[questionId];
          const isCurrent = currentIndex === index;

          return (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`aspect-square min-w-10 min-h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all text-base font-bold relative ${
                isAnswered
                  ? isUnsure
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm"
                    : "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm"
                  : isCurrent
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm"
                  : isUnsure
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
              {isUnsure && !isAnswered && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <span className="text-gray-600">Soal saat ini</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
          <span className="text-gray-600">Sudah dijawab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
          <span className="text-gray-600">Ragu-ragu & dijawab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-200 relative">
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
          </div>
          <span className="text-gray-600">Ragu-ragu belum dijawab</span>
        </div>
      </div>

      {/* Review button */}
      <button
        onClick={onReviewClick}
        className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <FaEye size={16} />
        <span>Review Jawaban</span>
      </button>
    </div>
  );
}
