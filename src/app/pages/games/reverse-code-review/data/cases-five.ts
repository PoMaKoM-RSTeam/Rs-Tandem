import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_FIVE: ReviewCase[] = [
  {
    id: '011',
    category: 'reverseCodeReview.data.c011.category',
    difficulty: 'Middle',
    title: 'reverseCodeReview.data.c011.title',
    code: `import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-analytics',
  template: \`<div>{{ pageViews }} views</div>\`,
})
export class AnalyticsComponent implements OnInit {
  pageViews = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.pageViews++;
        this.trackPageView();
      });
  }

  private trackPageView(): void {
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({
        page: window.location.href,
        token: 'auth-secret-789',
      }),
    });
  }
}`,
    expectedErrors: [
      {
        line: 16,
        type: ErrorType.MemoryLeak,
        message: 'reverseCodeReview.data.c011.msg0',
        points: 1,
      },
      {
        line: 27,
        type: ErrorType.Security,
        message: 'reverseCodeReview.data.c011.msg1',
        points: 1,
      },
    ],
  },

  {
    id: '012',
    category: 'reverseCodeReview.data.c012.category',
    difficulty: 'Junior',
    title: 'reverseCodeReview.data.c012.title',
    code: `import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  template: \`
    <div *ngFor="let user of getUsers() | async">
      <span>{{ user.name }}</span>
      <span>{{ getUsers() | async | json }}</span>
    </div>
  \`,
})
export class UserListComponent {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('/api/users');
  }
}`,
    expectedErrors: [
      {
        line: 8,
        type: ErrorType.Performance,
        message: 'reverseCodeReview.data.c012.msg0',
        points: 1,
      },
      {
        line: 10,
        type: ErrorType.Performance,
        message: 'reverseCodeReview.data.c012.msg1',
        points: 1,
      },
      {
        line: 17,
        type: ErrorType.BestPractice,
        message: 'reverseCodeReview.data.c012.msg2',
        points: 1,
      },
    ],
  },
];
