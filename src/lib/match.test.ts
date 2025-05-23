import { matchInsuredName } from './match';

describe('matchInsuredName', () => {
  it('matches "Riley HealthCare" to Riley HealthCare LLC', () => {
    const result = matchInsuredName('Riley HlthCare');
    expect(result.internalId).toBe('A1B2');
    console.log(result);
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('returns null if no match', () => {
    const result = matchInsuredName('Nothing Entity');
    expect(result.internalId).toBeNull();
  });
   it('matches full name with suffix: "Riley HealthCare LLC"', () => {
    const result = matchInsuredName('Riley HealthCare LLC');
    expect(result.internalId).toBe('A1B2');
  });

  it('ignores case differences', () => {
    const result = matchInsuredName('riley healthcare llc');
    expect(result.internalId).toBe('A1B2');
  });

  it('removes corporate suffixes like "Inc."', () => {
    const result = matchInsuredName('Northstar Logistics Inc');
    expect(result.internalId).toBe('G7H8');
  });

  it('matches despite missing word: "Quail Creek"', () => {
    const result = matchInsuredName('Quail Creek');
    expect(result.internalId).toBe('C3D4');
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('handles slight typos and swapped letters: "Wiliam Jame Group"', () => {
    const result = matchInsuredName('Wiliam Jame Group');
    expect(result.internalId).toBe('E5F6');
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });
});
