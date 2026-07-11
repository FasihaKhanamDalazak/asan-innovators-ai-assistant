import axios from "axios";

/**
 * Base URL is never hardcoded — it comes from the environment so the same
 * build can point at local, staging, or production backends.
 * Set VITE_API_BASE_URL in your .env file (see .env.example).
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  // Fails loudly in dev so a missing .env doesn't silently break requests.
  console.warn(
    "[Asan AI Assistant] VITE_API_BASE_URL is not set. Add it to your .env file."
  );
}

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s — generous enough for LLM-backed responses
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpClient;
