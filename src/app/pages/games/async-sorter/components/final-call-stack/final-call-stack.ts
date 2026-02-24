import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ul[tndm-final-call-stack]',
  templateUrl: './final-call-stack.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './final-call-stack.scss',
})
export class TndmFinalCallStack {}
