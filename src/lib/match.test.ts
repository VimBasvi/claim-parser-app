import { matchInsuredName } from './match';

describe('matchInsuredName', () => {
  it('matches "Riley HealthCare" to Riley HealthCare LLC', () => {
    const result = matchInsuredName('Riley HealthCare');
    expect(result.internalId).toBe('A1B2');
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('returns null if no match', () => {
    const result = matchInsuredName('Nonexistent Entity');
    expect(result.internalId).toBeNull();
  });
});
