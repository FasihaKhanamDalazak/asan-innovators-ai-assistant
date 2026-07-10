import { useCallback, useEffect, useRef } from "react";
import Header from "../components/Header/Header.jsx";
import Hero from "../components/Hero/Hero.jsx";
import ChatInput from "../components/ChatInput/ChatInput.jsx";
import ChatContainer from "../components/ChatContainer/ChatContainer.jsx";
import { useChat } from "../hooks/useChat.js";

// How close to the bottom (px) the user must be for new messages to
// auto-scroll. Beyond this, we assume they're deliberately reading back
// through history and leave their scroll position alone.
const AUTO_SCROLL_THRESHOLD_PX = 120;

/**
 * Top-level page. The Hero is permanent — it never unmounts or hides.
 * ChatInput is docked at the bottom of the viewport; Hero and the
 * conversation scroll independently in the space above it.
 */
function ChatPage() {
  const { messages, isLoading, sendMessage, resetChat } = useChat();

  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  // Track whether the user is near the bottom so we know whether an
  // incoming message should pull their view down or leave it be.
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScroll.current = distanceFromBottom < AUTO_SCROLL_THRESHOLD_PX;
  }, []);

  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading]);

  // Logo click: clear the conversation and bring the hero back into view.
  const handleLogoClick = useCallback(() => {
    resetChat();
    shouldAutoScroll.current = true;
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [resetChat]);

  const showConversation = messages.length > 0 || isLoading;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header onLogoClick={handleLogoClick} />

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="scrollbar-elegant flex-1 overflow-y-auto"
      >
        <Hero onStarterSelect={sendMessage} />

        {showConversation && (
          <ChatContainer
            messages={messages}
            isLoading={isLoading}
            onFollowUpSelect={sendMessage}
          />
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

export default ChatPage;