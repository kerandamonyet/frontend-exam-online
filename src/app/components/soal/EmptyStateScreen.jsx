// components/EmptyStateScreen.jsx
export default function EmptyStateScreen({ onBackClick }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="text-gray-400 text-5xl mb-4">📭</div>
        <p className="text-xl font-bold text-gray-600">
          Tidak ada soal tersedia...
        </p>
        <button
          onClick={onBackClick}
          className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
