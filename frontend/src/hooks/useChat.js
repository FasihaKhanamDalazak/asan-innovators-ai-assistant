import { useCallback, useState } from "react";
import { sendChatMessage } from "../services/api.js";
import { generateId } from "../utils/helpers.js";
import { MESSAGE_ROLES } from "../utils/constants.js";

/**
 * Encapsulates all chat state and behavior:
 * - message history (user + assistant)
 * - loading state while awaiting a response
 * - error state for failed requests
 * - hasStartedChat, which drives the hero -> chat transition
 *
 * Components stay purely presentational; all logic lives here.
 */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const sendMessage = useCallback(async (rawText) => {
    const text = rawText.trim();
    if (!text) return;

    setError(null);
    setHasStartedChat(true);

    const userMessage = {
      id: generateId(),
      role: MESSAGE_ROLES.USER,
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { answer, followUps } = await sendChatMessage(text);

      const assistantMessage = {
        id: generateId(),
        role: MESSAGE_ROLES.ASSISTANT,
        text: answer,
        followUps,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message);

      // Surface the failure as an assistant-style message so the
      // conversation flow doesn't visually break.
      const errorMessage = {
        id: generateId(),
        role: MESSAGE_ROLES.ASSISTANT,
        text: err.message,
        followUps: [],
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setHasStartedChat(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    hasStartedChat,
    sendMessage,
    resetChat,
  };
}
