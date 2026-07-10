/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {

      colors: {
        // Backgrounds
        background: "#FAF8F5", // warm off-white — page background, never pure white
        surface: {
          DEFAULT: "#FFFFFF", // cards, assistant messages, chat container, inputs
          user: "#F5EFE1",
          input: "#FFFFFF", // soft warm ivory — user message bubble
        }, // cards, chat container, inputs

        // Text
        "text-primary": "#1A1206", // headings, chat messages, important labels
        "text-secondary": "#6B7280", // descriptions, placeholders, metadata, timestamps

        // Accent gold
        gold: {
          DEFAULT: "#FBBF24", // primary gold
          hover: "#F59E0B", // hover gold
        },

        // Borders / dividers
        border: {
          DEFAULT: "#E8E4DD", // subtle borders
          divider: "#ECE8E1", // almost-invisible divider lines
        },

        // Status
        success: "#16A34A",
        error: "#DC2626",
      },
      fontFamily: {
        // Headings — elegant serif, used sparingly for hero/section titles
        display: ["Fraunces", "serif"],
        // Body — everything else
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        button: "9999px",
        input: "18px",
        chip: "9999px",
      },
      boxShadow: {
        card: "0 8px 20px rgba(245, 158, 11, 0.08)",
        "card-hover": "0 12px 28px rgba(245, 158, 11, 0.12)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%)",
      },
      maxWidth: {
        content: "1280px",
        chat: "900px",
      },
      spacing: {
        "hero-top": "120px",
        "hero-bottom": "80px",
      },
      transitionDuration: {
        200: "200ms",
      },
      keyframes: {
        shimmer: {
          "0%": {
            backgroundPosition: "200% center",
          },
          "100%": {
            backgroundPosition: "-200% center",
          },
        },
      },

      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
