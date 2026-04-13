import { ErrorType } from '../models/error-type.enum';
import { ReviewCase } from '../models/review-case.model';

export const CASES_THREE: ReviewCase[] = [
  {
    id: '003',
    category: 'reverseCodeReview.data.c003.category',
    difficulty: 'Junior',
    title: 'reverseCodeReview.data.c003.title',
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-comment',
  template: \`
    <article>
      <div [innerHTML]="commentBody"></div>
      <a [href]="userLink">Profile</a>
    </article>
  \`,
})
export class CommentComponent {
  commentBody = '';
  userLink = '';

  private readonly API_KEY = 'sk-abc123-secret-key-do-not-share';

  loadComment(id: string): void {
    fetch('/api/comments/' + id, {
      headers: { 'X-Api-Key': this.API_KEY },
    }).then(res => res.json())
      .then(data => {
        this.commentBody = data.body;
        this.userLink = data.authorUrl;
      });
  }
}`,
    expectedErrors: [
      {
        line: 7,
        type: ErrorType.Security,
        message: 'reverseCodeReview.data.c003.msg0',
        points: 1,
      },
      {
        line: 16,
        type: ErrorType.Security,
        message: 'reverseCodeReview.data.c003.msg1',
        points: 1,
      },
    ],
  },

  {
    id: '009',
    category: 'reverseCodeReview.data.c009.category',
    difficulty: 'Middle',
    title: 'reverseCodeReview.data.c009.title',
    code: `import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  template: \`
    <input [(ngModel)]="query" />
    <button (click)="search()">Search</button>
    <div [innerHTML]="resultHtml"></div>
  \`,
})
export class SearchComponent {
  query = '';
  resultHtml = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  search(): void {
    const url = '/api/search?q=' + this.query;
    this.http.get<{ html: string }>(url).subscribe(res => {
      this.resultHtml = res.html;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.query = params['q'];
        this.search();
      }
    });
  }
}`,
    expectedErrors: [
      {
        line: 10,
        type: ErrorType.Security,
        message: 'reverseCodeReview.data.c009.msg0',
        points: 1,
      },
      {
        line: 23,
        type: ErrorType.Security,
        message: 'reverseCodeReview.data.c009.msg1',
        points: 1,
      },
    ],
  },
];
