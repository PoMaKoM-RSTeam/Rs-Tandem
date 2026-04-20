import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_ONE: ReviewCase[] = [
  {
    id: '002',
    category: 'reverseCodeReview.data.c002.category',
    difficulty: 'Junior',
    title: 'reverseCodeReview.data.c002.title',
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
        message: 'reverseCodeReview.data.c002.msg0',
        points: 1,
      },
      {
        line: 9,
        type: ErrorType.Performance,
        message: 'reverseCodeReview.data.c002.msg1',
        points: 1,
      },
      {
        line: 10,
        type: ErrorType.Performance,
        message: 'reverseCodeReview.data.c002.msg2',
        points: 1,
      },
    ],
  },

  {
    id: '007',
    category: 'reverseCodeReview.data.c007.category',
    difficulty: 'Junior',
    title: 'reverseCodeReview.data.c007.title',
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
        message: 'reverseCodeReview.data.c007.msg0',
        points: 1,
      },
      {
        line: 15,
        type: ErrorType.Performance,
        message: 'reverseCodeReview.data.c007.msg1',
        points: 1,
      },
      {
        line: 19,
        type: ErrorType.Performance,
        message: 'reverseCodeReview.data.c007.msg2',
        points: 1,
      },
    ],
  },

  {
    id: '008',
    category: 'reverseCodeReview.data.c008.category',
    difficulty: 'Middle',
    title: 'reverseCodeReview.data.c008.title',
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
        message: 'reverseCodeReview.data.c008.msg0',
        points: 1,
      },
      {
        line: 28,
        type: ErrorType.Performance,
        message: 'reverseCodeReview.data.c008.msg1',
        points: 1,
      },
    ],
  },
];
