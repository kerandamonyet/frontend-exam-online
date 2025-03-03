import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaQuestion,
  FaSave,
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

  // Render content based on question type
  const renderQuestionContent = () => {
    if (currentSoal.tipe_soal === "pilihan_ganda") {
      // Render multiple choice options
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
      // Render line matching question
      const dataTarikGaris = currentSoal.data_tarik_garis || {};
      const opsiKiri = dataTarikGaris.opsi_kiri || [];
      const opsiKanan = dataTarikGaris.opsi_kanan || [];

      return (
        <div ref={containerRef} className="relative mt-8">
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
                strokeWidth="2"
              />
            ))}
          </svg>

          <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-4">
            {/* Left column - Questions */}
            <div className="flex-1 space-y-4 z-10">
              <div className="text-center mb-2 bg-gray-200 py-2 rounded-lg font-medium">
                Pertanyaan
              </div>
              {opsiKiri.map((item, index) => (
                <div
                  key={`left-${index}`}
                  data-key={item}
                  className={`left-item border-2 rounded-lg p-3 cursor-pointer ${
                    selectedLeft === item
                      ? isUnsure
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-purple-500 bg-purple-50"
                      : Object.keys(connections).includes(item)
                      ? isUnsure
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-purple-300 bg-purple-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleLeftItemClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Right column - Answers */}
            <div className="flex-1 space-y-4 z-10">
              <div className="text-center mb-2 bg-gray-200 py-2 rounded-lg font-medium">
                Jawaban
              </div>
              {opsiKanan.map((item, index) => (
                <div
                  key={`right-${index}`}
                  data-key={item}
                  className={`right-item border-2 rounded-lg p-3 cursor-pointer ${
                    Object.values(connections).includes(item)
                      ? isUnsure
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-purple-300 bg-purple-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleRightItemClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">
            <p>
              Instruksi: Klik pada pertanyaan terlebih dahulu, kemudian klik
              pada jawaban yang sesuai untuk menghubungkannya.
            </p>
          </div>
        </div>
      );
    } else if (currentSoal.tipe_soal === "drag_drop") {
      // Placeholder for drag and drop questions
      return (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p>Soal tipe drag & drop belum didukung.</p>
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

      {/* Render question content based on question type */}
      {renderQuestionContent()}

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
