import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_TWO: ReviewCase[] = [
  {
    id: '001',
    category: 'Memory Leaks',
    difficulty: 'Junior',
    title: 'Leaky Subscription',
    code: `import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  template: \`<div>{{ userName }}</div>\`,
})
export class DashboardComponent implements OnInit {
  userName = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.userName = user.name;
    });

    interval(5000).subscribe(() => {
      this.userService.refresh();
    });
  }
}`,
    expectedErrors: [
      {
        line: 15,
        type: ErrorType.MemoryLeak,
        message:
          'Subscription without unsubscribe in ngOnDestroy. Use takeUntilDestroyed(), async pipe, or manual cleanup.',
        points: 1,
      },
      {
        line: 19,
        type: ErrorType.MemoryLeak,
        message:
          'interval() never completes. Without unsubscribe, this runs indefinitely even after component is destroyed.',
        points: 1,
      },
    ],
  },

  {
    id: '004',
    category: 'Best Practice',
    difficulty: 'Middle',
    title: 'The Subscribe Pyramid',
    code: `import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { OrderService } from './order.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-order-page',
  template: \`<div>{{ status }}</div>\`,
})
export class OrderPageComponent implements OnInit {
  status = '';

  constructor(
    private auth: AuthService,
    private orders: OrderService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe(user => {
      this.orders.getByUserId(user.id).subscribe(orders => {
        this.notify.getUnread(user.id).subscribe(notes => {
          this.status = \`\${orders.length} orders, \${notes.length} notifications\`;
        });
      });
    });
  }
}`,
    expectedErrors: [
      {
        line: 21,
        type: ErrorType.BestPractice,
        message:
          'Nested subscribes form a "callback pyramid". Use switchMap/concatMap to flatten the observable chain.',
        points: 1,
      },
      {
        line: 20,
        type: ErrorType.MemoryLeak,
        message:
          'Nested subscriptions without cleanup. Each inner subscribe creates a leak that is never unsubscribed.',
        points: 1,
      },
    ],
  },
];
