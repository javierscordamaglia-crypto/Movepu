import React from "react";

const WorkoutDetail = ({ setCurrentView, selectedWorkout, db, authInstance, userId, showMessage }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <h1 className="text-3xl font-bold mb-8">Workout Detail Page</h1>
    <button
      onClick={() => setCurrentView("program")}
      className="px-6 py-2 rounded-full bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
    >
      Torna al Programma
    </button>
  </div>
);

export default WorkoutDetail;
