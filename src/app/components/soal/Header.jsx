import { FaClock, FaUserGraduate } from "react-icons/fa";

export default function Header({ timeLeft, studentName }) {
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
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
            value={studentName}
            disabled
            className="bg-transparent text-white border-none outline-none font-semibold max-w-32 sm:max-w-none truncate"
          />
        </div>
      </div>
    </div>
  );
}