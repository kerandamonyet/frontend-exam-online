// components/FeedbackToast.jsx
export default function FeedbackToast({ type }) {
  const isSuccess = type === "success";

  return (
    <div
      className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl shadow-lg z-50 animate-bounce"
      style={{
        backgroundColor: isSuccess
          ? "rgb(220, 252, 231)"
          : "rgb(254, 249, 195)",
        color: isSuccess ? "rgb(22, 101, 52)" : "rgb(161, 98, 7)",
      }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{isSuccess ? "✅" : "🤔"}</span>
        <p className="font-bold">
          {isSuccess ? "Jawaban disimpan!" : "Ditandai ragu-ragu!"}
        </p>
      </div>
    </div>
  );
}
