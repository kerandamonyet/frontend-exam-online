// components/LoadingScreen.jsx
export default function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="animate-bounce text-purple-600 text-4xl mb-4">📚</div>
        <p className="text-xl font-bold text-purple-800">Memuat soal...</p>
      </div>
    </div>
  );
}
