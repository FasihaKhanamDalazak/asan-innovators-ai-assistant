import { motion } from "framer-motion";

/**
 * Renders a row of rounded pill chips. Clicking a chip calls onSelect
 * with its label. Purely presentational — content and click behavior
 * are owned by the parent.
 *
 * @param {string[]} chips
 * @param {(label: string) => void} onSelect
 * @param {"center"|"start"} [align="center"]
 */
function SuggestedChips({ chips, onSelect, align = "center" }) {
  if (!chips?.length) return null;

  return (
    <div
      className={`flex flex-wrap gap-3 ${
        align === "start" ? "justify-start" : "justify-center"
      }`}
      role="group"
      aria-label="Suggested questions"
    >
      {chips.map((chip, index) => (
        <motion.button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -2 }}
          className="
            rounded-chip border border-border bg-surface
            px-5 py-2.5 text-sm font-medium text-text-primary
            shadow-card transition-200
            hover:border-gold hover:shadow-card-hover
            focus-visible:outline-none
          "
        >
          {chip}
        </motion.button>
      ))}
    </div>
  );
}

export default SuggestedChips;
