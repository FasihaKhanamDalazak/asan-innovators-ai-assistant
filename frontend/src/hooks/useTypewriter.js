import { useEffect, useState } from "react";

const TYPING_SPEED_MS = 70;
const DELETING_SPEED_MS = 35;
const PAUSE_AFTER_TYPING_MS = 1000;
const PAUSE_AFTER_DELETING_MS = 300;

/**
 * Cycles through a list of phrases with a natural type -> pause -> delete
 * -> next loop. Returns only the current visible substring; the blinking
 * cursor is rendered separately via CSS so it never stalls between phrases.
 *
 * @param {string[]} phrases
 */
export function useTypewriter(phrases) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases?.length) return;

    const currentPhrase = phrases[phraseIndex % phrases.length];
    let timeoutId;

    if (!isDeleting && displayedText === currentPhrase) {
      // Finished typing the full phrase — pause, then start deleting.
      timeoutId = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPING_MS);
    } else if (isDeleting && displayedText === "") {
      // Finished deleting — pause briefly, then move to the next phrase.
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, PAUSE_AFTER_DELETING_MS);
    } else {
      // Actively typing or deleting a character.
      const nextLength = displayedText.length + (isDeleting ? -1 : 1);
      timeoutId = setTimeout(
        () => setDisplayedText(currentPhrase.slice(0, nextLength)),
        isDeleting ? DELETING_SPEED_MS : TYPING_SPEED_MS
      );
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, phraseIndex, phrases]);

  return displayedText;
}
