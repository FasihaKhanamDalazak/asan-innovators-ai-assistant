import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TypingIndicator from "../TypingIndicator/TypingIndicator.jsx";

// After this many ms, swap in a reassuring message so long waits
// (e.g. backend retrying a busy model) don't feel broken.
const SLOW_RESPONSE_THRESHOLD_MS = 8000;

/**
 * Renders in place of an assistant ChatMessage while a request is in
 * flight, so the loading state occupies the same visual slot a real
 * response will land in.
 */
function LoadingMessage() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSlow(true);
    }, SLOW_RESPONSE_THRESHOLD_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-start"
    >
      <div className="max-w-[80%] rounded-card border border-border bg-surface px-5 py-3 shadow-card">
        <TypingIndicator />
        {isSlow && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-[13px] text-text-secondary"
          >
            Still thinking, this can take a moment…
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default LoadingMessage;