import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const MAX_TEXTAREA_HEIGHT_PX = 160;

/**
 * Message composer. Enter sends, Shift+Enter inserts a newline.
 * Textarea grows with content up to a max height, then scrolls.
 *
 * @param {(text: string) => void} onSend
 * @param {boolean} isLoading
 */
function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    resizeTextarea();
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    requestAnimationFrame(resizeTextarea);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="border-t border-border-divider bg-background px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-chat items-end gap-3">
        <div className="flex-1 rounded-input border border-border bg-surface-input px-4 py-3 shadow-card transition-200 focus-within:border-gold">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask Asan AI Assistant anything…"
            disabled={isLoading}
            aria-label="Message"
            className="
              max-h-40 w-full resize-none bg-transparent text-[15px]
              text-text-primary placeholder:text-text-secondary
              focus:outline-none disabled:opacity-60
            "
          />
        </div>

        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          whileHover={canSend ? { y: -1 } : undefined}
          whileTap={canSend ? { scale: 0.95 } : undefined}
          aria-label="Send message"
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center rounded-button
            transition-200
            ${
              canSend
                ? "bg-gold-gradient text-text-primary shadow-card hover:shadow-card-hover"
                : "cursor-not-allowed bg-border text-text-secondary"
            }
          `}
        >
          <ArrowUp size={18} strokeWidth={2.25} />
        </motion.button>
      </div>
    </div>
  );
}

export default ChatInput;