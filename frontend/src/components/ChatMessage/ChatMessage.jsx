import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import FollowUpChips from "../FollowUpChips/FollowUpChips.jsx";
import { formatTimestamp } from "../../utils/helpers.js";
import { MESSAGE_ROLES } from "../../utils/constants.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a single message in the conversation, with role-based
 * alignment/styling, a timestamp, a copy-to-clipboard action for
 * assistant answers, and any follow-up chips attached to it.
 *
 * @param {object} message - { id, role, text, timestamp, followUps?, isError? }
 * @param {(question: string) => void} onFollowUpSelect
 */
function ChatMessage({ message, onFollowUpSelect }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === MESSAGE_ROLES.USER;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — fail silently, non-critical action.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex max-w-[80%] flex-col sm:max-w-[70%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`group relative rounded-card border px-5 py-3.5 text-[15px] leading-relaxed shadow-card ${isUser
              ? "border-border bg-surface-input"
              : message.isError
                ? "border-error/40 bg-surface"
                : "border-border bg-surface"
            }`}
        >
          {isUser || message.isError ? (
            <p
              className={`whitespace-pre-wrap ${message.isError ? "text-error" : "text-text-primary"
                }`}
            >
              {message.text}
            </p>
          ) : (
            <div className="markdown-answer text-text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </div>
          )}

          {!isUser && !message.isError && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy response"
              className="
                absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center
                rounded-full border border-border bg-surface text-text-secondary
                opacity-0 shadow-card transition-200
                hover:text-gold-hover group-hover:opacity-100
                focus-visible:opacity-100
              "
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          )}
        </div>

        <span className="mt-1.5 px-1 text-xs text-text-secondary">
          {formatTimestamp(message.timestamp)}
        </span>

        {!isUser && (
          <FollowUpChips followUps={message.followUps} onSelect={onFollowUpSelect} />
        )}
      </div>
    </motion.div>
  );
}

export default ChatMessage;
