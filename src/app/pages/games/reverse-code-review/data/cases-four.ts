import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_FOUR: ReviewCase[] = [
  {
    id: '005',
    category: 'reverseCodeReview.data.c005.category',
    difficulty: 'Junior',
    title: 'reverseCodeReview.data.c005.title',
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
        message: 'reverseCodeReview.data.c005.msg0',
        points: 1,
      },
      {
        line: 21,
        type: ErrorType.BestPractice,
        message: 'reverseCodeReview.data.c005.msg1',
        points: 1,
      },
    ],
  },

  {
    id: '006',
    category: 'reverseCodeReview.data.c006.category',
    difficulty: 'Junior',
    title: 'reverseCodeReview.data.c006.title',
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
        message: 'reverseCodeReview.data.c006.msg0',
        points: 1,
      },
      {
        line: 13,
        type: ErrorType.BestPractice,
        message: 'reverseCodeReview.data.c006.msg1',
        points: 1,
      },
      {
        line: 21,
        type: ErrorType.BestPractice,
        message: 'reverseCodeReview.data.c006.msg2',
        points: 1,
      },
    ],
  },

  {
    id: '010',
    category: 'reverseCodeReview.data.c010.category',
    difficulty: 'Middle',
    title: 'reverseCodeReview.data.c010.title',
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
        message: 'reverseCodeReview.data.c010.msg0',
        points: 1,
      },
      {
        line: 24,
        type: ErrorType.Performance,
        message: 'reverseCodeReview.data.c010.msg1',
        points: 1,
      },
      {
        line: 29,
        type: ErrorType.BestPractice,
        message: 'reverseCodeReview.data.c010.msg2',
        points: 1,
      },
    ],
  },
];
