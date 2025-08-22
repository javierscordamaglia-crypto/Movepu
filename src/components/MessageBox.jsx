import React from "react";

const MessageBox = ({ message, type, onClose }) => {
  const boxStyle =
    type === "error"
      ? "bg-red-100 border border-red-400 text-red-700"
      : "bg-green-100 border border-green-400 text-green-700";

  return (
    <div className={`p-4 rounded-lg mb-4 flex items-center justify-between ${boxStyle}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
      >
        Chiudi
      </button>
    </div>
  );
};

export default MessageBox;
