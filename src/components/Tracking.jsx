import React from "react";

const Tracking = ({ setCurrentView, db, authInstance, userId, showMessage }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <h1 className="text-3xl font-bold mb-8">Tracking Page</h1>
    <button
      onClick={() => setCurrentView("dashboard")}
      className="px-6 py-2 rounded-full bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
    >
      Indietro
    </button>
  </div>
);

export default Tracking;
