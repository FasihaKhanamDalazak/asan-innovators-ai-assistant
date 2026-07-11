import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = ["Thinking...", "Searching...", "Analyzing..."];
const SLOW_MESSAGE = "Still thinking, this can take a moment…";
const SLOW_RESPONSE_THRESHOLD_MS = 15000;

function TypingIndicator() {
  const [index, setIndex] = useState(0);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 1800);

    const slowTimer = setTimeout(() => {
      setIsSlow(true);
    }, SLOW_RESPONSE_THRESHOLD_MS);

    return () => {
      clearInterval(wordInterval);
      clearTimeout(slowTimer);
    };
  }, []);

  const currentText = isSlow ? SLOW_MESSAGE : WORDS[index];

  return (
    <div
      className="flex items-center justify-center h-6 w-fit min-w-[92px]"
      aria-label="Assistant is thinking"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentText}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="
            text-sm
            font-medium
            tracking-tight
            whitespace-nowrap

            text-transparent
            bg-clip-text
            bg-[length:200%_100%]

            bg-gradient-to-r
            from-text-secondary
            via-text-primary
            to-text-secondary

            animate-shimmer
          "
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default TypingIndicator;