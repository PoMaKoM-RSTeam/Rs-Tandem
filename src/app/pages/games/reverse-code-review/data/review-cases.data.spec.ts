import { REVIEW_CASES_DATA } from './review-cases.data';
import { ErrorType } from '../models/error-type.enum';

describe('REVIEW_CASES_DATA integrity', () => {
  it('should have unique ids across all cases', () => {
    const ids = REVIEW_CASES_DATA.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have non-empty title, category, code for each case', () => {
    for (const reviewCase of REVIEW_CASES_DATA) {
      expect(reviewCase.title.length).toBeGreaterThan(0);
      expect(reviewCase.category.length).toBeGreaterThan(0);
      expect(reviewCase.code.length).toBeGreaterThan(0);
    }
  });

  it('should have at least one expected error per case', () => {
    for (const reviewCase of REVIEW_CASES_DATA) {
      expect(reviewCase.expectedErrors.length).toBeGreaterThan(0);
    }
  });

  it('should have valid error types', () => {
    const validTypes = Object.values(ErrorType);
    for (const reviewCase of REVIEW_CASES_DATA) {
      for (const err of reviewCase.expectedErrors) {
        expect(validTypes).toContain(err.type);
      }
    }
  });

  it('should have error lines within the code line range', () => {
    for (const reviewCase of REVIEW_CASES_DATA) {
      const lineCount = reviewCase.code.split('\n').length;
      for (const err of reviewCase.expectedErrors) {
        expect(err.line).toBeGreaterThanOrEqual(1);
        expect(err.line).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('should have positive points for all errors', () => {
    for (const reviewCase of REVIEW_CASES_DATA) {
      for (const err of reviewCase.expectedErrors) {
        expect(err.points).toBeGreaterThan(0);
      }
    }
  });

  it('should have non-empty error messages', () => {
    for (const reviewCase of REVIEW_CASES_DATA) {
      for (const err of reviewCase.expectedErrors) {
        expect(err.message.length).toBeGreaterThan(0);
      }
    }
  });

  it('should have a valid difficulty value', () => {
    const validDifficulties = ['Junior', 'Middle', 'Senior'];
    for (const reviewCase of REVIEW_CASES_DATA) {
      expect(validDifficulties).toContain(reviewCase.difficulty);
    }
  });
});
