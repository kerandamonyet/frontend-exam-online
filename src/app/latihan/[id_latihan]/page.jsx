"use client";

import { useEffect, useState } from "react";
import { getSoalByLatihanId } from "../../../../lib/data"; // ✅ Menggunakan API dari lib/data.js

// Implementasi Algoritma Fisher-Yates Shuffle
const fisherYatesShuffle = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function ExamCard() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await getSoalByLatihanId(); // ✅ Panggil API dari lib/data.js
        if (response.success && Array.isArray(response.data)) {
          const shuffledData = fisherYatesShuffle(response.data); // Acak soal
          setQuestions(shuffledData);
        } else {
          console.error("Format data tidak sesuai", response);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    loadQuestions();
  }, []);

  return (
    <div className="p-5">
      {questions.length === 0 ? (
        <p>Loading atau tidak ada soal tersedia...</p>
      ) : (
        questions.map((question, index) => (
          <div
            key={question.id}
            className="border p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="font-bold text-lg mb-2">Soal {index + 1}</h3>
            {/* Render text_soal dengan innerHTML */}
            <div
              className="mb-3"
              dangerouslySetInnerHTML={{ __html: question.text_soal }}
            />
            {Array.isArray(question.options) ? (
              question.options.map((option, i) => (
                <div key={i} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    id={`opt-${index}-${i}`}
                    value={option}
                  />
                  <label htmlFor={`opt-${index}-${i}`} className="ml-2">
                    {option}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-red-500">Opsi jawaban tidak tersedia.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
