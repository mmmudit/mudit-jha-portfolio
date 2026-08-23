export { TextFlip } from "./text-flip";
export type { TextFlipProps } from "./text-flip";

import { TextFlip } from "./text-flip";

export function FlipText({
  words,
  interval = 2.5,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  return (
    <TextFlip interval={interval} className={className}>
      {words.map((word) => (
        <span key={word}>{word}</span>
      ))}
    </TextFlip>
  );
}
