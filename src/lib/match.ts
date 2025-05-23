import { INSUREDS } from './data';
import { distance as levenshtein } from 'fastest-levenshtein';

const CORPORATE_SUFFIXES = [
  'llc', 'inc', 'corp', 'ltd', 'co', 'group', 'partners', 'services', 'holdings', 'solutions', 'plc'
];

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.,]/g, '') // remove punctuation
    .split(' ') // split into words
    .filter(word => !CORPORATE_SUFFIXES.includes(word))
    .join(' ')
    .trim();
}

export function matchInsuredName(extracted: string): 
({
  internalId: string | null;
  name: string | null;
  confidence: number;
  distance: number;
  allowPick?: boolean;
})

 {
  const extractedNorm = normalizeName(extracted);

  let bestMatch: {
    internalId: string | null;
    name: string | null;
    confidence: number;
    distance: number;
    allowPick?: boolean;
  } = { internalId: null, name: null, confidence: 0, distance: Infinity, allowPick: false };


  for (const insured of INSUREDS) {
    const insuredNorm = normalizeName(insured.name);
    const maxLen = Math.max(extractedNorm.length, insuredNorm.length);
    const dist = levenshtein(extractedNorm, insuredNorm);
    const similarity = 1 - dist / maxLen;

    if (similarity > bestMatch.confidence) {
      bestMatch = { internalId: insured.internalId, name: insured.name, confidence: similarity, distance: dist, allowPick:false };
    }
  }

  // If confidence < 0.8, consider it no match
  if (bestMatch.confidence < 0.8) {
    return {
      internalId: null,
      name: null,
      confidence: bestMatch.confidence,
      distance: bestMatch.distance,
      allowPick: true,
    };
  }

  return bestMatch;
}
