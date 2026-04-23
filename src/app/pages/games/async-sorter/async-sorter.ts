import { ChangeDetectionStrategy, Component, inject, signal, viewChild, WritableSignal } from '@angular/core';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { TndmCodeBlocksList } from './components/code-blocks-list/code-blocks-list';
import { TndmTaskBucketsList } from './components/task-buckets-list/task-buckets-list';
import { TndmFinalCallStack } from './components/final-call-stack/final-call-stack';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CodeBlockData, CodeBlockDroppedPayload, TASK_TYPES, TaskType } from './shared/types';
import { TndmTimer } from './components/timer/timer';
import { AsyncSorterFetcherService } from './services/async-sorter-fetcher.service';
import { TndmMovesCounter } from './components/moves-counter/moves-counter';
import { TndmMistakesCounter } from './components/mistakes-counter/mistakes-counter';
import { TndmToaster } from '../../../shared/ui/tndm-toaster/tndm-toaster';
import { ToastService } from '../../../core/toast/toast-service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'tndm-async-sorter',
  templateUrl: 'async-sorter.html',
  styleUrl: 'async-sorter.scss',
  imports: [
    TndmButton,
    TndmToaster,
    TndmCodeBlocksList,
    TndmTaskBucketsList,
    TndmFinalCallStack,
    CdkDropListGroup,
    TndmTimer,
    TndmMovesCounter,
    TndmMistakesCounter,
    TranslocoPipe,
  ],
  providers: [AsyncSorterFetcherService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAsyncSorter {
  readonly codeBlocksList = viewChild.required(TndmCodeBlocksList);
  readonly timer = viewChild.required(TndmTimer);
  private readonly fetcherService = inject(AsyncSorterFetcherService);
  private readonly toaster = inject(ToastService);

  readonly syncBucket = signal<CodeBlockData[]>([]);
  readonly microBucket = signal<CodeBlockData[]>([]);
  readonly macroBucket = signal<CodeBlockData[]>([]);

  readonly finalCallStack = signal<CodeBlockData[]>([]);
  readonly invisibleCodeBlocks = signal<CodeBlockData[]>([]);
  readonly buttonDisabled = signal(true);

  readonly moves = signal(0);
  readonly mistakes = signal(0);
  readonly movesBeforeFirstMistake = signal(0);

  private readonly isSourceListEmpty = signal(false);
  readonly isDraggingDisabled = signal(false);
  readonly isButtonPressed = signal(false);
  private readonly isMistakeHappened = signal(false);

  private getBucketByType(type: TaskType): WritableSignal<CodeBlockData[]> {
    switch (type) {
      case TASK_TYPES.sync:
        return this.syncBucket;
      case TASK_TYPES.micro:
        return this.microBucket;
      case TASK_TYPES.macro:
        return this.macroBucket;
      default:
        throw new Error(
          'taskType of current block that is being moved from its bucket to final call stack is not recognized '
        );
    }
  }

  async runLoop(): Promise<void> {
    const animationQueue = [...this.syncBucket(), ...this.microBucket(), ...this.macroBucket()].sort(
      (a, b) => a.executionOrder - b.executionOrder
    );

    if (!animationQueue.length) {
      return;
    }
    this.animateBlocks(animationQueue);

    this.timer().stop();
    this.buttonDisabled.set(true);
    this.isDraggingDisabled.set(true);
    this.isButtonPressed.set(true);

    const error = await this.fetcherService.uploadGameStats({
      seconds: this.timer().seconds(),
      moves: this.moves(),
      mistakes: this.mistakes(),
      movesBeforeFirstMistake: this.movesBeforeFirstMistake(),
    });

    if (error) {
      this.toaster.warning(`Failed to save results to DB`, error.message);
    }
  }

  onCodeBlockDropped(payload: CodeBlockDroppedPayload): void {
    const { codeBlockData, bucketTaskType } = payload;

    const isCorrectBucket = codeBlockData.taskType === bucketTaskType;
    if (!isCorrectBucket) {
      this.mistakes.update(mistakes => (mistakes += 1));
      this.isMistakeHappened.set(true);
    }

    this.codeBlocksList().removeCodeBlock(codeBlockData.executionOrder);

    this.moves.update(number => (number += 1));

    if (this.isSourceListEmpty() && !this.areAllBlocksPlacedCorrectly()) {
      this.buttonDisabled.set(true);
    }

    if (!this.isMistakeHappened()) {
      this.movesBeforeFirstMistake.update(moves => (moves += 1));
    }
  }

  onSourceListIsEmpty(): void {
    this.isSourceListEmpty.set(true);

    if (this.areAllBlocksPlacedCorrectly()) {
      this.buttonDisabled.set(false);
    }
  }

  private areAllBlocksPlacedCorrectly(): boolean {
    return (
      this.syncBucket().every(block => block.taskType === TASK_TYPES.sync) &&
      this.microBucket().every(block => block.taskType === TASK_TYPES.micro) &&
      this.macroBucket().every(block => block.taskType === TASK_TYPES.macro)
    );
  }

  private animateBlocks(queue: CodeBlockData[]): void {
    let currentIndex = 0;

    const moveBlock = (): void => {
      if (currentIndex >= queue.length) return;
      const { movingBlockData, oldRect } = this.prepareBlockForAnimation(currentIndex, queue);

      requestAnimationFrame(() => {
        const animationTime = 1000;
        const movingBlockElement = this.positionBlockBeforeAnimation(oldRect, movingBlockData);
        if (!movingBlockElement) return;

        requestAnimationFrame(() => {
          this.performAnimation(movingBlockData, animationTime, movingBlockElement);

          setTimeout(() => {
            movingBlockElement.style.transition = '';
            movingBlockElement.style.transform = '';
          }, animationTime);
        });

        currentIndex++;
        setTimeout(moveBlock, animationTime);
      });
    };

    moveBlock();
  }

  private getBlocksRect(blockData: CodeBlockData): DOMRect {
    const element = document.querySelector(`[data-execution-order="${blockData.executionOrder}"]`);
    const rect = element?.getBoundingClientRect();
    if (!rect) throw new Error(`Code block element with execution order ${blockData.executionOrder} not found`);
    return rect;
  }

  private removeBlockFromBucket(blockData: CodeBlockData): void {
    const bucket = this.getBucketByType(blockData.taskType);
    bucket.update(items => items.filter(i => i.executionOrder !== blockData.executionOrder));
  }

  private addBlockToFinalCallStack(blockData: CodeBlockData): void {
    this.invisibleCodeBlocks.update(items => [...items, blockData]);
    this.finalCallStack.update(items => [...items, blockData]);
  }

  private prepareBlockForAnimation(
    queueIndex: number,
    queue: CodeBlockData[]
  ): { oldRect: DOMRect; movingBlockData: CodeBlockData } {
    const movingBlockData = queue[queueIndex];
    const oldRect = this.getBlocksRect(movingBlockData);

    this.removeBlockFromBucket(movingBlockData);
    this.addBlockToFinalCallStack(movingBlockData);

    return { movingBlockData, oldRect };
  }

  private positionBlockBeforeAnimation(oldRect: DOMRect, currentMovingBlock: CodeBlockData): HTMLElement | undefined {
    const codeBLock = document.querySelector(`[data-execution-order="${currentMovingBlock.executionOrder}"]`);
    if (!(codeBLock instanceof HTMLElement)) return;

    const newRect = codeBLock.getBoundingClientRect();

    const deltaX = oldRect.left - newRect.left;
    const deltaY = oldRect.top - newRect.top;

    codeBLock.style.transition = 'none';
    codeBLock.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    return codeBLock;
  }

  private performAnimation(
    movingBlockData: CodeBlockData,
    animationTime: number,
    movingBlockElement: HTMLElement
  ): void {
    this.invisibleCodeBlocks.update(items =>
      items.filter(item => item.executionOrder !== movingBlockData.executionOrder)
    );

    movingBlockElement.style.transition = `transform ${animationTime}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
    movingBlockElement.style.transform = 'translate(0, 0)';
  }
}
