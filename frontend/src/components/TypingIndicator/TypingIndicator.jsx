import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = ["Thinking...", "Searching...", "Analyzing..."];

function TypingIndicator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-center h-6 w-[92px]"
      aria-label="Assistant is thinking"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
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
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default TypingIndicator;