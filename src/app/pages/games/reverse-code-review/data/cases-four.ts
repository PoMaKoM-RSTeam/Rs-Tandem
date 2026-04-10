import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_FOUR: ReviewCase[] = [
  {
    id: '005',
    category: 'Best Practice',
    difficulty: 'Junior',
    title: 'DOM Manipulation',
    code: `import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-highlight',
  template: \`
    <div id="target-box" class="box">
      <p id="message">Hello World</p>
    </div>
    <button (click)="highlight()">Highlight</button>
  \`,
})
export class HighlightComponent implements OnInit {
  ngOnInit(): void {
    const el = document.getElementById('target-box');
    if (el) {
      el.style.border = '2px solid blue';
    }
  }

  highlight(): void {
    const msg = document.querySelector('#message');
    if (msg) {
      (msg as HTMLElement).style.color = 'red';
      (msg as HTMLElement).style.fontWeight = 'bold';
    }
  }
}`,
    expectedErrors: [
      {
        line: 14,
        type: ErrorType.BestPractice,
        message:
          "Direct DOM access via document.getElementById bypasses Angular's abstraction. Use @ViewChild and Renderer2.",
        points: 1,
      },
      {
        line: 21,
        type: ErrorType.BestPractice,
        message:
          "Direct DOM manipulation with querySelector. Use Angular's @ViewChild, Renderer2, or host bindings instead.",
        points: 1,
      },
    ],
  },

  {
    id: '006',
    category: 'Best Practice',
    difficulty: 'Junior',
    title: 'The Any Kingdom',
    code: `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  getData(params: any): Observable<any> {
    return this.http.get('/api/data', { params });
  }

  transformData(input: any): any {
    const result: any = {};
    for (const key of Object.keys(input)) {
      result[key] = (input as any)[key].toString();
    }
    return result;
  }

  processItems(items: any[]): void {
    items.forEach((item: any) => {
      console.log(item.name);
    });
  }
}`,
    expectedErrors: [
      {
        line: 9,
        type: ErrorType.BestPractice,
        message: 'Using "any" for both parameter and return type removes all type safety. Define proper interfaces.',
        points: 1,
      },
      {
        line: 13,
        type: ErrorType.BestPractice,
        message: 'Function signature uses "any" everywhere. Create typed interfaces for input and output.',
        points: 1,
      },
      {
        line: 21,
        type: ErrorType.BestPractice,
        message: 'Array of "any" defeats TypeScript\'s purpose. Define an interface with the expected shape.',
        points: 1,
      },
    ],
  },

  {
    id: '010',
    category: 'Best Practice / State',
    difficulty: 'Middle',
    title: 'Shared State Mutation',
    code: `import { Injectable } from '@angular/core';

export interface AppState {
  users: string[];
  settings: { theme: string; lang: string };
}

@Injectable({ providedIn: 'root' })
export class StateService {
  state: AppState = {
    users: [],
    settings: { theme: 'light', lang: 'en' },
  };

  addUser(name: string): void {
    this.state.users.push(name);
  }

  setTheme(theme: string): void {
    this.state.settings.theme = theme;
  }

  get userCount(): number {
    console.log('userCount accessed');
    return this.state.users.length;
  }

  removeUser(index: number): void {
    this.state.users.splice(index, 1);
  }
}`,
    expectedErrors: [
      {
        line: 16,
        type: ErrorType.BestPractice,
        message:
          "Direct mutation of shared state array with push(). Other won't detect the change. Use immutable updates.",
        points: 1,
      },
      {
        line: 24,
        type: ErrorType.Performance,
        message:
          'console.log in a getter runs on every access, lower performance. Remove debug logging from production code.',
        points: 1,
      },
      {
        line: 29,
        type: ErrorType.BestPractice,
        message: "Array.splice mutates the array in place. Components using OnPush won't detect this change.",
        points: 1,
      },
    ],
  },
];
