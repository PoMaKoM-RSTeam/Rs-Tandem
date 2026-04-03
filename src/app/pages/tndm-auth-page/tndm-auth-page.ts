import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DotGrid } from '../../shared/components/dot-grid/dot-grid';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-auth-page',
  imports: [RouterOutlet, DotGrid],
  templateUrl: './tndm-auth-page.html',
  styleUrl: './tndm-auth-page.scss',
})
export class TndmAuthPage {}
