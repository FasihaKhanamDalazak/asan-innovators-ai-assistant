import { MessageCircle } from "lucide-react";

/**
 * Small fallback for the (edge-case) moment ChatContainer renders
 * before any message exists yet.
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient">
        <MessageCircle size={20} className="text-text-primary" />
      </span>
      <p className="text-sm text-text-secondary">
        Ask a question to start the conversation.
      </p>
    </div>
  );
}

export default EmptyState;
