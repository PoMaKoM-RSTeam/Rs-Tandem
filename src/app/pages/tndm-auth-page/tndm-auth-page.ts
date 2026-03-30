import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-auth-page',
  imports: [RouterOutlet, TranslocoPipe],
  templateUrl: './tndm-auth-page.html',
  styleUrl: './tndm-auth-page.scss',
})
export class TndmAuthPage {}
