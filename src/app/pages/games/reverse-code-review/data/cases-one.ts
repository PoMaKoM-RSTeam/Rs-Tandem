import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_ONE: ReviewCase[] = [
  {
    id: '002',
    category: 'Performance',
    difficulty: 'Junior',
    title: 'Template Traps',
    code: `import { Component } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-card',
  template: \`
    <div class="card">
      <h2>{{ getFullName() }}</h2>
      <span>{{ formatDate(createdAt) }}</span>
      <p *ngIf="isAdmin()">Admin Panel</p>
    </div>
  \`,
})
export class UserCardComponent {
  createdAt = new Date();

  constructor(private userService: UserService) {}

  getFullName(): string {
    return this.userService.currentUser.first + ' ' +
      this.userService.currentUser.last;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US');
  }

  isAdmin(): boolean {
    return this.userService.currentUser.role === 'admin';
  }
}`,
    expectedErrors: [
      {
        line: 8,
        type: ErrorType.Performance,
        message:
          'Method call in template triggers on every change detection cycle. Use a computed property or pipe instead.',
        points: 1,
      },
      {
        line: 9,
        type: ErrorType.Performance,
        message: 'formatDate() in template recalculates on every CD cycle. Use DatePipe or pre-compute the value.',
        points: 1,
      },
      {
        line: 10,
        type: ErrorType.Performance,
        message:
          'Method call in template runs on every change detection. Cache the result in a property or use a pipe.',
        points: 1,
      },
    ],
  },

  {
    id: '007',
    category: 'Performance',
    difficulty: 'Junior',
    title: 'List Rendering Issues',
    code: `import { Component } from '@angular/core';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-task-list',
  template: \`
    <ul>
      <li *ngFor="let task of tasks">
        <input type="checkbox" [checked]="task.done" />
        <span [style.color]="getColor(task)">{{ task.title }}</span>
        <button (click)="remove(task)">Delete</button>
      </li>
    </ul>
    <p>Total: {{ calculateTotal() }}</p>
  \`,
})
export class TaskListComponent {
  tasks: Task[] = [];

  getColor(task: Task): string {
    return task.done ? 'green' : 'black';
  }

  calculateTotal(): number {
    return this.tasks.filter(t => t.done).length;
  }

  remove(task: Task): void {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
  }
}`,
    expectedErrors: [
      {
        line: 13,
        type: ErrorType.Performance,
        message: 'Missing trackBy function in *ngFor. Without it, Angular re-creates all DOM elements on every change.',
        points: 1,
      },
      {
        line: 15,
        type: ErrorType.Performance,
        message:
          'getColor() method call in template triggers on every change detection cycle.Use ngClass + property instead.',
        points: 1,
      },
      {
        line: 19,
        type: ErrorType.Performance,
        message: 'calculateTotal() runs filter on every CD cycle. Use a computed property or pipe to cache the result.',
        points: 1,
      },
    ],
  },

  {
    id: '008',
    category: 'Performance',
    difficulty: 'Middle',
    title: 'Manual Change Detection',
    code: `import {
  Component,
  ChangeDetectorRef,
  OnInit,
  NgZone,
} from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-live-feed',
  template: \`
    <div *ngFor="let item of items">{{ item.text }}</div>
  \`,
})
export class LiveFeedComponent implements OnInit {
  items: { text: string }[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.dataService.fetchItems().subscribe(data => {
        this.items = data;
        this.cdr.detectChanges();
      });
    }, 3000);
  }

  addItem(text: string): void {
    this.items.push({ text });
    this.cdr.detectChanges();
  }

  reset(): void {
    this.items = [];
    this.cdr.detectChanges();
  }
}`,
    expectedErrors: [
      {
        line: 25,
        type: ErrorType.MemoryLeak,
        message: 'setInterval without cleanup in ngOnDestroy. The interval keeps running after component is destroyed.',
        points: 1,
      },
      {
        line: 28,
        type: ErrorType.Performance,
        message:
          'Manual detectChanges() inside setInterval is an anti-pattern. Use async pipe with an Observable timer.',
        points: 1,
      },
    ],
  },
];
