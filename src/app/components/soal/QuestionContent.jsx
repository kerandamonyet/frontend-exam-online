import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaQuestion,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

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
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [connections, setConnections] = useState({});
  const [linePositions, setLinePositions] = useState([]);
  const containerRef = useRef(null);

  // Parse current answer JSON if available
  useEffect(() => {
    if (currentSoal.tipe_soal === "tarik_garis" && currentAnswer) {
      try {
        const parsed = JSON.parse(currentAnswer);
        setConnections(parsed);
      } catch (e) {
        setConnections({});
      }
    }
  }, [currentSoal, currentAnswer]);

  // Update line positions whenever connections change
  useEffect(() => {
    if (currentSoal.tipe_soal === "tarik_garis" && containerRef.current) {
      calculateLinePositions();
    }
  }, [connections, currentSoal]);

  // Calculate positions for drawing connection lines
  const calculateLinePositions = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const leftElements = container.querySelectorAll(".left-item");
    const rightElements = container.querySelectorAll(".right-item");

    const newLinePositions = [];

    Object.entries(connections).forEach(([leftKey, rightKey]) => {
      const leftEl = Array.from(leftElements).find(
        (el) => el.dataset.key === leftKey
      );
      const rightEl = Array.from(rightElements).find(
        (el) => el.dataset.key === rightKey
      );

      if (leftEl && rightEl) {
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        newLinePositions.push({
          x1: leftRect.right - containerRect.left,
          y1: leftRect.top + leftRect.height / 2 - containerRect.top,
          x2: rightRect.left - containerRect.left,
          y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        });
      }
    });

    setLinePositions(newLinePositions);
  };

  // Handle window resize to recalculate line positions
  useEffect(() => {
    const handleResize = () => {
      if (currentSoal.tipe_soal === "tarik_garis") {
        calculateLinePositions();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSoal, connections]);

  // Handle click on a left item
  const handleLeftItemClick = (key) => {
    setSelectedLeft(selectedLeft === key ? null : key);
  };

  // Handle click on a right item
  const handleRightItemClick = (key) => {
    if (selectedLeft) {
      const newConnections = { ...connections };

      // Remove any existing connection to this right item
      Object.keys(newConnections).forEach((leftKey) => {
        if (newConnections[leftKey] === key) {
          delete newConnections[leftKey];
        }
      });

      // Remove any existing connection from the selected left item
      delete newConnections[selectedLeft];

      // Add the new connection
      newConnections[selectedLeft] = key;

      setConnections(newConnections);
      onAnswerChange(JSON.stringify(newConnections));
      setSelectedLeft(null); // Clear selection after making a connection
    }
  };

  // Reset all line connections
  const handleResetAllConnections = () => {
    setConnections({});
    onAnswerChange(JSON.stringify({}));
    setSelectedLeft(null);
  };

  // Render content based on question type
  const renderQuestionContent = () => {
    if (currentSoal.tipe_soal === "pilihan_ganda") {
      // Multiple choice options rendering
      const options = [
        currentSoal.opsi_a,
        currentSoal.opsi_b,
        currentSoal.opsi_c,
        currentSoal.opsi_d,
      ];

      return (
        <div className="space-y-3">
          {options.map((option, i) => {
            const letter = String.fromCharCode(97 + i);
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
      );
    } else if (currentSoal.tipe_soal === "tarik_garis") {
      // Improved line matching question for mobile
      const dataTarikGaris = currentSoal.data_tarik_garis || {};
      const opsiKiri = dataTarikGaris.opsi_kiri || [];
      const opsiKanan = dataTarikGaris.opsi_kanan || [];

      return (
        <div ref={containerRef} className="relative mt-4">
          {/* Instructions with better visibility */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-2">
              <FaQuestion size={16} className="text-blue-600" />
            </div>
            <p>
              Klik pada pertanyaan terlebih dahulu, kemudian klik pada jawaban
              yang sesuai.
            </p>
          </div>

          {/* Column headers with better visual distinction */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="bg-purple-100 py-2 rounded-lg font-medium text-center text-purple-800">
              Pertanyaan
            </div>
            <div className="bg-purple-100 py-2 rounded-lg font-medium text-center text-purple-800">
              Jawaban
            </div>
          </div>

          {/* SVG for connection lines */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {linePositions.map((line, index) => (
              <line
                key={`line-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={isUnsure ? "#F59E0B" : "#8B5CF6"}
                strokeWidth="3"
              />
            ))}
          </svg>

          {/* Grid layout for items - more consistent on mobile */}
          <div className="grid grid-cols-2 gap-4 items-start z-10">
            {/* Left column - Questions */}
            <div className="space-y-3 z-10">
              {opsiKiri.map((item, index) => (
                <div
                  key={`left-${index}`}
                  data-key={item}
                  className={`left-item border-2 rounded-lg p-3 text-center flex items-center justify-center min-h-16 cursor-pointer ${
                    selectedLeft === item
                      ? isUnsure
                        ? "border-yellow-500 bg-yellow-50 shadow-md"
                        : "border-purple-500 bg-purple-50 shadow-md"
                      : Object.keys(connections).includes(item)
                      ? isUnsure
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-purple-300 bg-purple-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleLeftItemClick(item)}
                >
                  {selectedLeft === item && (
                    <div className="absolute -right-3 bg-purple-500 text-white rounded-full p-1 z-20">
                      <FaArrowRight size={12} />
                    </div>
                  )}
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Right column - Answers */}
            <div className="space-y-3 z-10">
              {opsiKanan.map((item, index) => (
                <div
                  key={`right-${index}`}
                  data-key={item}
                  className={`right-item border-2 rounded-lg p-3 text-center flex items-center justify-center min-h-16 cursor-pointer ${
                    Object.values(connections).includes(item)
                      ? isUnsure
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-purple-300 bg-purple-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleRightItemClick(item)}
                >
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset button separated for better visibility */}
          {Object.keys(connections).length > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleResetAllConnections}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <FaUndo size={14} />
                <span>Reset Jawaban</span>
              </button>
            </div>
          )}
        </div>
      );
    } else {
      // Default case for unknown question types
      return (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p>Tipe soal tidak dikenali.</p>
        </div>
      );
    }
  };

  return (
    <>
      {/* Question display */}
      <div
        className={`p-4 rounded-xl mb-4 ${
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

      {/* Render question content based on question type */}
      {renderQuestionContent()}

      {/* Improved navigation buttons - fix to bottom on mobile */}
      <div className=" bg-white border-t border-gray-200 p-3 flex justify-between items-center">
        <button
          onClick={onPrevClick}
          disabled={isFirstQuestion}
          className={`px-3 py-2 rounded-lg flex items-center ${
            isFirstQuestion
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-purple-100 text-purple-600 hover:bg-purple-200"
          }`}
        >
          <FaArrowLeft size={14} />
          Sebelumnya
        </button>

        <div className="flex gap-2">
          <button
            onClick={onToggleUnsure}
            className={`px-3 py-2 rounded-lg flex items-center ${
              isUnsure
                ? "bg-yellow-400 text-white"
                : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
            }`}
          >
            <FaQuestion size={14} />
          </button>

          <button
            onClick={onSaveAnswer}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:shadow-lg flex items-center gap-2"
          >
            <FaSave size={14} />
            <span>Simpan</span>
          </button>
        </div>

        {isLastQuestion ? (
          <button
            onClick={onReviewClick}
            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg flex items-center"
          >
            <FaEye size={14} />
          </button>
        ) : (
          <button
            onClick={onNextClick}
            className="px-3 py-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg flex items-center"
          >
            <FaArrowRight size={14} />
            Selanjutnya
          </button>
        )}
      </div>

      {/* Add padding at the bottom to account for fixed navigation */}
      <div className="pb-16"></div>
    </>
  );
}
