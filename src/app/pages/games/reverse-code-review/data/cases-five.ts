import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_FIVE: ReviewCase[] = [
  {
    id: '011',
    category: 'Memory Leak',
    difficulty: 'Middle',
    title: 'Router Event Leak',
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
        message:
          'Router events subscription without unsubscribe. Use takeUntilDestroyed() or manual cleanup in ngOnDestroy.',
        points: 1,
      },
      {
        line: 27,
        type: ErrorType.Security,
        message:
          'Authentication token hardcoded in client-side code. Use an HTTP interceptor or environment config instead.',
        points: 1,
      },
    ],
  },

  {
    id: '012',
    category: 'Performance',
    difficulty: 'Junior',
    title: 'Async Pipe Misuse',
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
        message:
          'getUsers() in template creates a new request on every change of cycle. Store the observable in a property.',
        points: 1,
      },
      {
        line: 10,
        type: ErrorType.Performance,
        message:
          'sec. getUsers() creates yet another subscription and request. Reuse a single observable with shareReplay.',
        points: 1,
      },
      {
        line: 17,
        type: ErrorType.BestPractice,
        message: 'Using "any[]" loses type safety. Define a User interface with the expected properties.',
        points: 1,
      },
    ],
  },
];
