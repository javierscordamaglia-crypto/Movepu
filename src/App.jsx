import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "./firebaseConfig"; // usa auth e db già inizializzati
import { onAuthStateChanged } from "firebase/auth";

import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Program from "./components/Program";
import WorkoutDetail from "./components/WorkoutDetail";
import Tracking from "./components/Tracking";
import Nutrition from "./components/Nutrition";
import Motivation from "./components/Motivation";
import MessageBox from "./components/MessageBox";

const App = () => {
  const [currentView, setCurrentView] = useState("login");
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = "info") => setMessage({ text, type });
  const closeMessage = () => setMessage(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setCurrentView("dashboard");
      } else {
        setUserId(null);
        setCurrentView("login");
      }
    });

    return () => unsubscribe();
  }, []);

  let ViewComponent;
  switch (currentView) {
    case "login":
      ViewComponent = <LoginPage setCurrentView={setCurrentView} authInstance={auth} />;
      break;
    case "dashboard":
      ViewComponent = <Dashboard setCurrentView={setCurrentView} authInstance={auth} db={db} />;
      break;
    case "program":
      ViewComponent = <Program setCurrentView={setCurrentView} authInstance={auth} db={db} userId={userId} showMessage={showMessage} />;
      break;
    case "workoutDetail":
      ViewComponent = <WorkoutDetail setCurrentView={setCurrentView} selectedWorkout={null} db={db} authInstance={auth} userId={userId} showMessage={showMessage} />;
      break;
    case "tracking":
      ViewComponent = <Tracking setCurrentView={setCurrentView} db={db} authInstance={auth} userId={userId} showMessage={showMessage} />;
      break;
    case "nutrition":
      ViewComponent = <Nutrition setCurrentView={setCurrentView} showMessage={showMessage} />;
      break;
    case "motivation":
      ViewComponent = <Motivation setCurrentView={setCurrentView} />;
      break;
    default:
      ViewComponent = <Dashboard setCurrentView={setCurrentView} authInstance={auth} db={db} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex flex-col items-center py-8">
      <AnimatePresence mode="wait">
        {ViewComponent && (
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {ViewComponent}
          </motion.div>
        )}
      </AnimatePresence>

      {message && <MessageBox message={message.text} type={message.type} onClose={closeMessage} />}
    </div>
  );
};

export default App;



