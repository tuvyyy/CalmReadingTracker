// components/AnswerButton.tsx
import type { CSSProperties } from 'react';

type Letter = 'A' | 'B' | 'C' | 'D';

interface AnswerButtonProps {
  letter: Letter;
  selected: boolean;
  correct?: boolean;   // undefined = not graded
  wrong?: boolean;
  onClick: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}

export default function AnswerButton({
  letter,
  selected,
  correct,
  wrong,
  onClick,
  disabled,
  style,
}: AnswerButtonProps) {
  let cls = 'answer-btn';
  if (correct) {
    cls += ' correct';
  } else if (wrong) {
    cls += ' wrong';
  } else if (selected) {
    cls += ` selected-${letter}`;
  }

  return (
    <button
      className={cls}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`Đáp án ${letter}`}
      style={style}
    >
      {letter}
    </button>
  );
}
