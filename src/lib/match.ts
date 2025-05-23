import { INSUREDS } from './data';
import { distance as levenshtein } from 'fastest-levenshtein';

const CORPORATE_SUFFIXES = [
  'llc', 'inc', 'corp', 'ltd', 'co', 'group', 'partners', 'services', 'holdings', 'solutions', 'plc'
];

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.,]/g, '') // remove punctuation
    .split(' ')
    .filter(word => !CORPORATE_SUFFIXES.includes(word))
    .join(' ')
    .trim();
}

export function matchInsuredName(extracted: string): {
  internalId: string | null;
  confidence: number;
} {
  const extractedNorm = normalizeName(extracted);

  let bestMatch = { internalId: null, confidence: 0 };

  for (const insured of INSUREDS) {
    const insuredNorm = normalizeName(insured.name);
    const maxLen = Math.max(extractedNorm.length, insuredNorm.length);
    const dist = levenshtein(extractedNorm, insuredNorm);
    const similarity = 1 - dist / maxLen;

    if (similarity > bestMatch.confidence) {
      bestMatch = { internalId: insured.internalId, confidence: similarity };
    }
  }

  // If confidence < 0.8, consider it no match
  if (bestMatch.confidence < 0.8) {
    return { internalId: null, confidence: bestMatch.confidence };
  }

  return bestMatch;
}
