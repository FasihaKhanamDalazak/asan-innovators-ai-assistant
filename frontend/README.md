# Asan AI Assistant — Frontend

The official AI assistant frontend for **Asan Innovators**. Built with React 19, Vite, Tailwind CSS, Axios, and Framer Motion.

## Getting Started

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your backend
npm run dev
```

## Environment Variables

| Variable              | Description                                    |
| ---------------------- | ----------------------------------------------- |
| `VITE_API_BASE_URL`    | Base URL of the chat backend (no trailing slash) |

## Backend Contract

```
POST {VITE_API_BASE_URL}/chat
Request:  { "message": "string" }
Response: { "answer": "string", "follow_ups": ["string", ...] }
```

The frontend never calls anything else — all requests flow through `src/services/api.js`.

## Folder Structure

```
src/
  components/
    Header/           Persistent top bar with branding
    Hero/              Landing headline, typewriter animation, starter chips
    SuggestedChips/    Reusable pill-chip list (used by Hero and FollowUpChips)
    ChatContainer/      Scrollable, auto-scrolling message list
    ChatMessage/         Single message bubble (user/assistant), timestamp, copy button
    ChatInput/            Composer with auto-resizing textarea
    FollowUpChips/         Follow-up question chips beneath assistant replies
    TypingIndicator/        Pulsing-dot loading animation
    LoadingMessage/           Assistant-shaped bubble hosting TypingIndicator
    EmptyState/                Fallback for an empty conversation
  pages/
    ChatPage.jsx        Orchestrates Header + Hero <-> chat transition
  hooks/
    useChat.js          Owns all chat state (messages, loading, error)
    useTypewriter.js     Hero phrase-cycling animation logic
  services/
    httpClient.js        Axios instance (base URL from env)
    api.js                sendChatMessage() — the only function that calls the backend
  utils/
    constants.js          Starter chips, typewriter phrases, message roles
    helpers.js             ID generation, timestamp formatting
  styles/
    index.css              Tailwind layers + global base styles
```

## Design System

Colors, fonts, radii, and shadows are defined as Tailwind theme tokens in
`tailwind.config.js` (e.g. `bg-background`, `text-text-primary`, `font-display`,
`rounded-card`, `shadow-card`, `bg-gold-gradient`) so every component stays
visually consistent by construction.

- Headings: **Fraunces** (serif) — `font-display`
- Body: **Inter** — `font-sans`
- Background: warm off-white `#FAF8F5`
- Accent: gold gradient `#FBBF24 → #F59E0B`, used sparingly

## Build

```bash
npm run build
npm run preview
```
