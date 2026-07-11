import { motion } from "framer-motion";
import TypingIndicator from "../TypingIndicator/TypingIndicator.jsx";

/**
 * Renders in place of an assistant ChatMessage while a request is in
 * flight, so the loading state occupies the same visual slot a real
 * response will land in.
 */
function LoadingMessage() {
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
      </div>
    </motion.div>
  );
}

export default LoadingMessage;
