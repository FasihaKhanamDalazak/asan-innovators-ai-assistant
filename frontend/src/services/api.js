import httpClient from "./httpClient.js";

/**
 * Sends a user message to the backend and returns the assistant's reply.
 *
 * Request:  POST /chat  { message: string }
 * Response: { answer: string, follow_ups: string[] }
 *
 * @param {string} message - The user's message text.
 * @returns {Promise<{answer: string, followUps: string[]}>}
 * @throws {Error} A normalized error with a user-friendly `message`.
 */
export async function sendChatMessage(message) {
  try {
    const { data } = await httpClient.post("/chat", { message });

    return {
      answer: data?.answer ?? "",
      followUps: Array.isArray(data?.follow_ups) ? data.follow_ups : [],
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
}

/**
 * Converts Axios/network errors into a consistent, user-facing Error object
 * so the UI layer never has to know about Axios internals.
 */
function normalizeApiError(error) {
  if (error.response) {
    // Server responded with a non-2xx status
    const status = error.response.status;
    const serverMessage = error.response.data?.message;

    if (status >= 500) {
      return new Error(
        serverMessage || "Something went wrong on our end. Please try again."
      );
    }
    if (status === 429) {
      return new Error("Too many requests — please wait a moment and try again.");
    }
    return new Error(serverMessage || "We couldn't process that request.");
  }

  if (error.request) {
    // Request was made but no response received (network/timeout)
    return new Error(
      "Unable to reach the Asan AI Assistant. Please check your connection."
    );
  }

  // Something happened while setting up the request
  return new Error("Unexpected error. Please try again.");
}
