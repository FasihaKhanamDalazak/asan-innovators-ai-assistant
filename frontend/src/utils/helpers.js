/**
 * Generates a reasonably unique id for chat messages.
 * Not cryptographically unique — sufficient for React keys + local state.
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Formats a Date into a short, elegant timestamp (e.g. "10:42 AM").
 */
export function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
