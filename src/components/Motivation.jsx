import React from "react";

const Motivation = ({ setCurrentView }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <h1 className="text-3xl font-bold mb-8">Motivation Page</h1>
    <button
      onClick={() => setCurrentView("dashboard")}
      className="px-6 py-2 rounded-full bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
    >
      Indietro
    </button>
  </div>
);

export default Motivation;
