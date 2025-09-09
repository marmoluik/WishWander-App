import { parseIntent } from '../../src/services/intent';

describe('parseIntent', () => {
  it('parses shift dates', () => {
    expect(parseIntent('shift dates +3d')).toEqual({ type: 'shiftDates', days: 3 });
  });
  it('parses budget', () => {
    expect(parseIntent('budget ≤ €100')).toEqual({ type: 'capBudget', amount: 100 });
  });
});
