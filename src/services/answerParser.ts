// services/answerParser.ts
// Parses raw answer key text into structured answer objects.

export type AnswerLetter = 'A' | 'B' | 'C' | 'D';
export type PartNumber = 5 | 6 | 7;

export interface ParsedAnswer {
  questionNo: number;
  answer: AnswerLetter;
  part: PartNumber;
}

/** Determine TOEIC Reading part from question number */
function getPart(n: number): PartNumber {
  if (n >= 101 && n <= 130) return 5;
  if (n >= 131 && n <= 146) return 6;
  return 7;
}

/**
 * Parse raw answer key text into an array of ParsedAnswer.
 *
 * Supported formats:
 *   - "101A 102C 103D 104B"
 *   - "101. A 102. C 103. D"
 *   - "101-A 102-C 103-D"
 *   - "A C D B ..." (bare letters, auto-mapped from 101)
 *
 * Only accepts question numbers 101–200 and letters A/B/C/D.
 */
export function parseAnswerKey(rawText: string): ParsedAnswer[] {
  const text = rawText.trim();
  if (!text) return [];

  const results: ParsedAnswer[] = [];

  // --- Strategy 1: Numbered answers ---
  // Match patterns like: 101A | 101. A | 101-A | 101) A
  const numberedPattern = /\b(1\d{2})\s*[-.):]?\s*([ABCD])\b/gi;
  const numberedMatches = [...text.matchAll(numberedPattern)];

  if (numberedMatches.length > 0) {
    const seen = new Set<number>();
    for (const match of numberedMatches) {
      const no = parseInt(match[1], 10);
      const ans = match[2].toUpperCase() as AnswerLetter;
      if (no >= 101 && no <= 200 && !seen.has(no)) {
        seen.add(no);
        results.push({ questionNo: no, answer: ans, part: getPart(no) });
      }
    }
    // Sort by question number
    results.sort((a, b) => a.questionNo - b.questionNo);
    return results;
  }

  // --- Strategy 2: Bare letter sequence ---
  // "A C D B A ..." auto-mapped starting from 101
  const letterPattern = /\b([ABCD])\b/gi;
  const letterMatches = [...text.matchAll(letterPattern)];

  if (letterMatches.length > 0) {
    let qNo = 101;
    for (const match of letterMatches) {
      if (qNo > 200) break;
      const ans = match[1].toUpperCase() as AnswerLetter;
      results.push({ questionNo: qNo, answer: ans, part: getPart(qNo) });
      qNo++;
    }
  }

  return results;
}
