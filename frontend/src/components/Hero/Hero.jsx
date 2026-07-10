import { motion } from "framer-motion";
import SuggestedChips from "../SuggestedChips/SuggestedChips.jsx";
import { useTypewriter } from "../../hooks/useTypewriter.js";
import { STARTER_CHIPS, TYPEWRITER_PHRASES } from "../../utils/constants.js";

/**
 * The landing hero. Shown before the first message is sent.
 * onStarterSelect is called with a chip's label when clicked, which the
 * parent wires to useChat().sendMessage to kick off the conversation.
 *
 * @param {(question: string) => void} onStarterSelect
 */
function Hero({ onStarterSelect }) {
  const typedPhrase = useTypewriter(TYPEWRITER_PHRASES);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto flex max-w-content flex-col items-center px-6 pt-hero-top pb-8 text-center sm:px-8"

    >
      {/* Heading */}
      <h1 className="font-display text-4xl font-medium leading-tight text-text-primary sm:text-5xl md:text-6xl">
        Welcome to{" "}
        <span className="block bg-gold-gradient bg-clip-text font-semibold text-transparent sm:inline">
          Asan Innovators
        </span>
      </h1>

      {/* Subheading */}
      <p className="mt-5 font-sans text-lg text-text-secondary sm:text-xl">
        Your AI Assistant
      </p>

      {/* Typewriter line */}
      <div className="mt-3 flex h-8 items-center justify-center font-sans text-base text-text-secondary sm:text-lg">
        <span>Helping you with&nbsp;</span>
        <span className="font-medium text-text-primary">{typedPhrase}</span>
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-5 w-[2px] animate-blink bg-gold"
        />
      </div>

      {/* Starter chips */}
      <div className="mt-10 w-full">
        <SuggestedChips chips={STARTER_CHIPS} onSelect={onStarterSelect} />
      </div>
    </motion.section>
  );
}

export default Hero;
