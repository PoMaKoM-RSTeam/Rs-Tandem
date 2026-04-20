import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_TWO: ReviewCase[] = [
  {
    id: '001',
    category: 'reverseCodeReview.data.c001.category',
    difficulty: 'Junior',
    title: 'reverseCodeReview.data.c001.title',
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
        message: 'reverseCodeReview.data.c001.msg0',
        points: 1,
      },
      {
        line: 19,
        type: ErrorType.MemoryLeak,
        message: 'reverseCodeReview.data.c001.msg1',
        points: 1,
      },
    ],
  },

  {
    id: '004',
    category: 'reverseCodeReview.data.c004.category',
    difficulty: 'Middle',
    title: 'reverseCodeReview.data.c004.title',
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
        message: 'reverseCodeReview.data.c004.msg0',
        points: 1,
      },
      {
        line: 20,
        type: ErrorType.MemoryLeak,
        message: 'reverseCodeReview.data.c004.msg1',
        points: 1,
      },
    ],
  },
];
