import { Sparkles } from "lucide-react";

/**
 * Slim, persistent header. Stays minimal and out of the way so the
 * hero / chat content remains the visual focus, matching the
 * editorial, whitespace-first design language.
 *
 * @param {() => void} [onLogoClick] - optional handler, e.g. reset to landing view
 */
function Header({ onLogoClick }) {
  return (
    <header className="w-full border-b border-border-divider bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 sm:px-8">
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2 rounded-button transition-200 focus-visible:outline-none"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-gradient">
            <Sparkles size={16} className="text-text-primary" strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
            Asan Innovators
          </span>
        </button>

        <span className="hidden text-sm text-text-secondary sm:inline-block">
          AI Assistant
        </span>
      </div>
    </header>
  );
}

export default Header;
