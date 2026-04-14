import { PUZZLES_DATA } from './puzzles.data';

describe('PUZZLES_DATA integrity', () => {
  it('should have unique ids across all puzzles', () => {
    const ids = PUZZLES_DATA.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have non-empty title, description, hintText for each puzzle', () => {
    for (const puzzle of PUZZLES_DATA) {
      expect(puzzle.title.length).toBeGreaterThan(0);
      expect(puzzle.description.length).toBeGreaterThan(0);
      expect(puzzle.hintText.length).toBeGreaterThan(0);
    }
  });

  it('should have at least one slot per puzzle', () => {
    for (const puzzle of PUZZLES_DATA) {
      expect(Object.keys(puzzle.slots).length).toBeGreaterThan(0);
    }
  });

  it('should have at least one available block per puzzle', () => {
    for (const puzzle of PUZZLES_DATA) {
      expect(puzzle.availableBlocks.length).toBeGreaterThan(0);
    }
  });

  it('should reference only existing block ids in acceptedBlockIds', () => {
    for (const puzzle of PUZZLES_DATA) {
      const blockIds = new Set(puzzle.availableBlocks.map(b => b.id));
      for (const slot of Object.values(puzzle.slots)) {
        for (const acceptedId of slot.acceptedBlockIds) {
          expect(blockIds.has(acceptedId)).toBe(true);
        }
      }
    }
  });

  it('should have unique block ids within each puzzle', () => {
    for (const puzzle of PUZZLES_DATA) {
      const blockIds = puzzle.availableBlocks.map(b => b.id);
      expect(new Set(blockIds).size).toBe(blockIds.length);
    }
  });

  it('should reference slot ids used in lines segments', () => {
    for (const puzzle of PUZZLES_DATA) {
      const slotIds = new Set(Object.keys(puzzle.slots));
      for (const line of puzzle.lines) {
        for (const seg of line.segments) {
          if (seg.kind === 'slot') {
            expect(slotIds.has(seg.slotId)).toBe(true);
          }
        }
      }
    }
  });

  it('every slot should have at least one correct block that is solvable', () => {
    for (const puzzle of PUZZLES_DATA) {
      for (const slot of Object.values(puzzle.slots)) {
        expect(slot.acceptedBlockIds.length).toBeGreaterThan(0);
      }
    }
  });

  it('should have a valid difficulty enum value', () => {
    const validDifficulties = ['easy', 'medium', 'hard'];
    for (const puzzle of PUZZLES_DATA) {
      expect(validDifficulties).toContain(puzzle.difficulty);
    }
  });
});
