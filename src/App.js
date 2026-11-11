import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScreenOne from "../src/component/ScreenOne";
import ScreenTwo from "../src/component/ScreenTwo";
import "../src/style/screenone.css";
import "../src/style/screentwo.css";

function App() {
  const [showScreenTwo, setShowScreenTwo] = useState(false);

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {!showScreenTwo ? (
          <motion.div
            key="ScreenOne"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* ScreenOne recibe una función para pasar a la siguiente pantalla */}
            <ScreenOne onEnter={() => setShowScreenTwo(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="ScreenTwo"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
            <ScreenTwo />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
