import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_SIX: ReviewCase[] = [
  {
    id: '013',
    category: 'Performance',
    difficulty: 'Middle',
    title: 'Zone.js Overload',
    code: `import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-canvas-draw',
  template: \`<canvas #canvas width="800" height="600"></canvas>\`,
})
export class CanvasDrawComponent implements OnInit, OnDestroy {
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId = 0;

  ngOnInit(): void {
    const canvas = document.querySelector('canvas');
    this.ctx = canvas?.getContext('2d') ?? null;
    this.animate();
  }

  animate(): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, 800, 600);
    this.ctx.fillRect(
      Math.random() * 800, Math.random() * 600, 50, 50
    );
    this.animationId = requestAnimationFrame(
      () => this.animate()
    );
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }
}`,
    expectedErrors: [
      {
        line: 12,
        type: ErrorType.BestPractice,
        message: 'Direct DOM access with document.querySelector. Use @ViewChild to get the canvas element reference.',
        points: 1,
      },
      {
        line: 23,
        type: ErrorType.Performance,
        message:
          'requestAnimationFrame inside NgZone triggers change detection ~60 times/sec.Use NgZone.runOutsideAngular().',
        points: 1,
      },
    ],
  },

  {
    id: '014',
    category: 'Security',
    difficulty: 'Middle',
    title: 'Unsafe Form Handling',
    code: `import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  template: \`
    <form (ngSubmit)="login()">
      <input [(ngModel)]="email" name="email" />
      <input [(ngModel)]="password" name="password"
        type="password" />
      <button type="submit">Login</button>
    </form>
    <div [innerHTML]="errorMessage"></div>
  \`,
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  login(): void {
    const url = \`/api/login?email=\${this.email}\`;
    this.http.post(url, { password: this.password })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        },
      });
  }
}`,
    expectedErrors: [
      {
        line: 14,
        type: ErrorType.Security,
        message:
          '[innerHTML] renders msg without sanitization. Could be exploited for XSS if the server reflects user input.',
        points: 1,
      },
      {
        line: 25,
        type: ErrorType.Security,
        message:
          'Email is passed in URL query string. Credentials in URLs are logged by proxies. Use request body instead.',
        points: 1,
      },
    ],
  },

  {
    id: '015',
    category: 'Best Practice',
    difficulty: 'Junior',
    title: 'Lifecycle Misuse',
    code: `import { Component, OnInit, OnChanges, SimpleChanges,
  Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  template: \`
    <h2>{{ userData?.name }}</h2>
    <p>{{ userData?.bio }}</p>
  \`,
})
export class ProfileComponent implements OnInit, OnChanges {
  @Input() userId!: string;
  userData: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadUser();
  }

  private loadUser(): void {
    this.http.get('/api/users/' + this.userId)
      .subscribe((data) => {
        this.userData = data;
      });
  }
}`,
    expectedErrors: [
      {
        line: 14,
        type: ErrorType.BestPractice,
        message: 'Using "any" for component data. Define a typed interface for the user object.',
        points: 1,
      },
      {
        line: 23,
        type: ErrorType.Performance,
        message:
          'ngOnChanges calls loadUser() without checking which input changed. First call also duplicates ngOnInit.',
        points: 1,
      },
      {
        line: 29,
        type: ErrorType.MemoryLeak,
        message:
          'subscription inside a method called on every input change, prev. requests are not cancelled: use switchMap.',
        points: 1,
      },
    ],
  },
];
