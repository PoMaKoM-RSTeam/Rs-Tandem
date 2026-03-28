import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_FIVE: ReviewCase[] = [
  {
    id: '000',
    category: 'Memory Leak',
    difficulty: 'Senior',
    title: 'TestCase1',
    code: `// After document load
requestAnimationFrame(update());

function update() {
    // Do some stuff
   requestAnimationFrame(update());

   while (i) {
      update()
   }
}
   console.log(sayHuh())`,
    expectedErrors: [
      {
        line: 3,
        type: ErrorType.MemoryLeak,
        message: 'test',
        points: 10,
        fixPattern: '',
        fixHint: '',
      },
    ],
  },
  {
    id: '0000',
    category: 'Performance',
    difficulty: 'Junior',
    title: 'Callbacks',
    code: `
setTimeout(() => {
  console.log("this is the first message");
}, 5000);
`,
    expectedErrors: [
      {
        line: 1,
        type: ErrorType.Performance,
        message: 'test.',
        points: 10,
        fixPattern: '',
        fixHint: '',
      },
    ],
  },
];
